import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import styles from './index.module.css'


class FileInput extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    accept: PropTypes.string,

    onUpload: PropTypes.func,
    endpoint: PropTypes.string,
  }

  static defaultProps = {
    errors: [],
    accept: '*',
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile(e) {
    const { files = [] } = e.target
    const file = files[0]
    const { onUpload, endpoint } = this.props

    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      this.setState({ uploading: true })
      fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
        .then(resp => {
          resp.json()
            .then(data => {
              onUpload && onUpload(data)
            })
            .catch(console.error)
        })
        .catch(console.error)
        .finally(() => {
          this.setState({ uploading: false })
        })
    }
  }

  render() {
    const {
      value,
      errors,
      className,
      disabled,
      accept,
    } = this.props

    const { uploading } = this.state

    return (
      <div className={styles.root}>
        <label
          className={classNames(
            className,
            styles.inputContainer,
            errors.length && styles.error,
            disabled && styles.disabled,
          )}
        >
          {!uploading && !value && 'Загрузить файл'}
          {!uploading && value && value.name}
          {uploading && 'Загрузка...'}
          <input {...{
            className: styles.fileInput,
            type: 'file',
            'data-cy': 'upload_button',
            accept,
            disabled,
            onChange: this.uploadFile,
          }} />
        </label>
        {!!errors.length &&
          <div className={styles.errors}>
            {errors.map((error, index) => (
              <div className={styles.errorText} key={index}>
                {error}
              </div>
            ))}
          </div>
        }
      </div>
    )
  }
}

export default FileInput
