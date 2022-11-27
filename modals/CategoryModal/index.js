import Modal from '../../components/Modal'

import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../../components/Icon'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import Button, { BUTTON_TYPES } from '../../components/Button'


const CategoryModal = ({ items, onClose, values, onChange, ...other }) => {
  let level = 1
  const secondBlock = []
  const level3Ids = new Set()
  const parents = items.filter(({ parent }) => !parent)
  const ids = {
    1: new Set(),
    2: new Set(),
    3: level3Ids,
    4: new Set(),
  }

  const [isSecondBlockVisible, setSecondBlockVisibility] = useState(false)
  const [clickedId, setClickedId] = useState(undefined)
  const [currentValue, setCurrentValue] = useState(values[0])
  const [selectedIds, setSelectedIds] = useState([])

  function getIds(arr, level) {
    arr?.forEach(({ parent, childs, id }) => {
      if (!parent || level === 2 || level === 4) {
        ids[level]?.add(id)
        getIds(childs, level + 1)
      } else if (level === 3) {
        const nextObject = items.find(item => item.id === id)
        ids[level].add(id)
        getIds(nextObject.childs, level + 1)
      }
    })
  }

  function getActiveIds(id) {
    let idLevel = 0
    const selectedCopy = new Set([...selectedIds])
    const parent = items.find(item => values[0] === item.id)?.parent

    for (level in ids) {
      if (ids[level].has(id)) {
        idLevel = level
        break
      }
    }

    switch (idLevel) {
      case '3':
        selectedCopy.add(id)
        selectedCopy.add(parent.id)
        break
      case '4':
        selectedCopy.add(id)
        selectedCopy.add(parent.parent)
        break
      default:
        selectedCopy.add(id)
    }

    setSelectedIds([...selectedCopy])
  }

  function getSecondBlock(arr) {
    arr?.forEach(({ parent, childs, id }) => {
      const isMainParent = !parent && childs.length
      const isMissingObject = level === 4 && level3Ids.has(id)

      if (isMissingObject) {
        const missingObject = items.find(item => item.id === id)

        secondBlock.push(missingObject)

      } else if ((isMainParent || level !== 1) && level < 4) {
        ++level
        if (level === 4) level3Ids.add(id)

        getSecondBlock(childs)
      }
    })
  }

  function selectCategory(id, level, hasChildren, parent = null) {
    const selectedCopy = deleteSelectedIds(parent, id)
    const isSecondBlock = level === 3 || level === 4

    if (!hasChildren) {
      setCurrentValue(id)
      setSecondBlockVisibility(isSecondBlock)
      selectedCopy.add(id)
    } else if (hasChildren && level === 2) {
      selectedCopy.add(id)
      setClickedId(id)
      setSecondBlockVisibility(true)
    }

    setSelectedIds([...selectedCopy])
  }

  function deleteSelectedIds(parent, id) {
    let count = 1
    const selectedCopy = new Set([...selectedIds])

    while (count <= 4) {
      ids[count].forEach(value => {
        if ((value !== parent) && value !== id) {
          selectedCopy.delete(value)
        }
      })
      count++
    }
    return selectedCopy
  }

  getSecondBlock(items)

  level = 1
  getIds(items, level)

  useEffect(() => {
    getActiveIds(values[0])

    if (ids[3].has(values[0]) || ids[4].has(values[0])) {
      setSecondBlockVisibility(true)
    } else {
      setSecondBlockVisibility(false)
    }
  }, [])

  function handleSubmit() {
    onChange([currentValue])
    onClose()
  }

  return (
    <Modal type="center" className={styles.root} {...other}>
      <Icon size={15} type={ICONS_TYPES.clear} className={styles.button} onClick={onClose} />
      <div className={styles.title}>Выберите процесс</div>
      <div className={styles.main}>
        <div className={styles.left}>
          {
            parents?.map(({ id, name, childs }) => {
              const isActive = selectedIds.includes(id)
              return (
                <div key={id} className={styles.categoryBlock}>
                  <div
                    className={
                      classNames(
                        styles.mainCategory,
                        { [styles.clickable]: !childs.length },
                        { [styles.active]: isActive })
                    }
                    onClick={() => selectCategory(id, 1, !!childs.length)}
                  >
                    {name}
                    {isActive &&
                      <Icon
                        type={ICONS_TYPES.confirm}
                        size={15}
                      />
                    }
                  </div>
                  {
                    childs?.map(({ id: subId, name: subName, childs: subChilds }) => {
                      const isActive = selectedIds.includes(subId)
                      return (
                        <div
                          key={subId}
                          className={classNames(styles.subCategory, { [styles.active]: isActive })}
                          onClick={() => selectCategory(subId, 2, !!subChilds.length)}
                        >
                          {subName}
                          {isActive &&
                            <Icon
                              type={ICONS_TYPES.confirm}
                              size={12}
                            />
                          }
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
        {isSecondBlockVisible &&
          <div className={styles.right}>
            {
              secondBlock?.map(({ id, name, childs, parent }) => {
                const childId = childs.find(child => child.id === currentValue)?.id
                const isChosen = id === currentValue || childId === currentValue || parent.id === clickedId

                if (isChosen) {
                  const isActive = selectedIds.includes(id)

                  return (
                    <div key={id} className={styles.categoryBlock}>
                      <div
                        className={
                          classNames(
                            styles.additionalCategory,
                            { [styles.clickable]: !childs.length },
                            { [styles.active]: isActive })
                        }
                        onClick={() => selectCategory(id, 3, !!childs.length, parent.id)}
                      >
                        {name}
                        {isActive &&
                          <Icon
                            type={ICONS_TYPES.confirm}
                            size={15}
                          />
                        }
                      </div>
                      {
                        childs?.map(({ id: subId, name: subName }) => {
                          const isActive = selectedIds.includes(subId)

                          return (
                            <div
                              key={subId}
                              className={classNames(styles.subAdditionalCategory, { [styles.active]: isActive })}
                              onClick={() => selectCategory(subId, 4, false, parent.id)}
                            >
                              {subName}
                              {isActive &&
                                <Icon
                                  type={ICONS_TYPES.confirm}
                                  size={12}
                                />
                              }
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }
                return null
              })
            }
          </div>
        }
      </div>
      <Button
        type={BUTTON_TYPES.fill}
        label="Применить"
        onClick={handleSubmit}
      />
    </Modal>
  )
}

export default CategoryModal
