import Modal from '../../components/Modal'

import Icon, { ICONS_TYPES } from '../../components/Icon'
import Input, { INPUT_TYPES } from '../../components/Input'
import Button from '../../components/Button'

import { getApiPath } from '../../helpers/fetch'
import { formatSize } from '../../helpers/format'

import styles from './index.module.css'
import FileInput from '../../components/FileInput'
import Image from 'next/image'


const NewRequest = ({ children, onClose, host, form, store, ...other }) => {
  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const fileApiPath = getApiPath(process.env.NEXT_PUBLIC_FILE_API, host)

  const attachmentSet = form.get('data.message_set.0.attachment_set') || []

  return (
    <Modal
      type="center"
      className={styles.root}
      width={700}
      onClose={onClose}
      {...other}
    >
      <Icon size={20} type={ICONS_TYPES.clear} className={styles.button} onClick={onClose} />
      <div className={styles.title}>Отправить запрос</div>
      <Input
        className={styles.input}
        label="Наименование"
        validate={{ required: true, checkOnBlur: true }}
        value={form.get('data.name')}
        errors={form.get('errors.name')}
        onChange={(value) => form.set('data.name', value)}
        onInvalid={(value) => form.set('errors.name', value)}
        onValid={() => form.set('errors.name', [])}
      />
      <Input
        className={styles.input}
        label="Описание"
        type={INPUT_TYPES.multi}
        minRows={5}
        validate={{ required: true, checkOnBlur: true }}
        value={form.get('data.message_set.0.text')}
        errors={form.get('errors.message_set.0.text')}
        onChange={(value) => form.set('data.message_set.0.text', value)}
        onInvalid={(value) => form.set('errors.message_set.0.text', value)}
        onValid={() => form.set('errors.message_set.0.text', [])}
      />
      <FileInput
        className={styles.attachmentButton}
        endpoint={fileApiPath + 'files/'}
        onUpload={(data) => form.set('data.message_set.0.attachment_set.' + attachmentSet.length, data)}
        onError={({ status, error }) => store.createFormStore('error', {
          modalComponent: 'MessageBox',
          props: {
            children: error || ('Непредвиденная ошибка ' + status),
          },
        })}
      >
        <Icon
          className={styles.attachmentIcon}
          type={ICONS_TYPES.attachment}
          size={32}
        />
        Прикрепит файл
      </FileInput>
      {!!attachmentSet.length && (
        <div className={styles.attachments}>
          {attachmentSet.map((item, i) => {
            const remove = () => {
              const newAttachmentSet = []
              const attachmentSetErrors = form.get('errors.attachment_set') || []
              const newAttachmentSetErrors = []

              attachmentSet.forEach((_, j) => {
                if (i !== j) {
                  newAttachmentSet.push(attachmentSet[j])
                  newAttachmentSetErrors.push(attachmentSetErrors[j])
                }
              })

              form.set('data.message_set.0.attachment_set', newAttachmentSet)
              form.set('errors.message_set.0.attachment_set', newAttachmentSetErrors)
            }

            if (item.type === 'IMAGE') {
              return (
                <div key={item.id} className={styles.attachmentWrapper}>
                  <Image
                    alt={item.filename}
                    src={item.file_url}
                    width={172}
                    height={172}
                    objectFit="cover"
                  />
                  <Icon
                    className={styles.iconClear}
                    size={14}
                    type={ICONS_TYPES.clear}
                    onClick={remove}
                  />
                </div>
              )
            }

            const ext = (item.filename.match(/\.([^\.]*)$/) || [])[1]
            return (
              <div key={item.id} className={styles.attachmentWrapper}>
                <div className={styles.attachment}>
                  <div className={styles.attachmentName}>
                    {item.filename}
                  </div>
                  <div className={styles.attachmentExt}>
                    {ext}
                  </div>
                  <div className={styles.attachmentSize}>
                    {formatSize(item.size)}
                  </div>
                </div>
                <Icon
                  className={styles.iconClear}
                  size={14}
                  type={ICONS_TYPES.clear}
                  onClick={remove}
                />
              </div>
            )}
          )}
        </div>
      )}

      <Button
        disabled={form.hasErrors}
        label="Отправить"
        onClick={() => {
          form.submit(custodianApiPath + 'order', 'POST')
          store.createFormStore('success', {
            modalComponent: 'MessageBox',
            props: {
              children: 'Ваш запрос отправлен. Ответ придет на вашу электронную почту и отобразится в личном кабинете.',
            },
          })
          onClose()
        }}
      />
    </Modal>
  )
}

export default NewRequest
