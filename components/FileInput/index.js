import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { FileUploader } from 'react-drag-drop-files'


const getFirstStringFromObject = (memo, value) => {
  if (memo && typeof memo === 'string') {
    return memo
  }
  if (value && typeof value === 'string') {
    return value
  }
  if (value && typeof value === 'object') {
    return Object.values(value).reduce(getFirstStringFromObject, '')
  }
  return ''
}

class FileInput extends PureComponent {
  static propTypes = {
    onUpload: PropTypes.func,
    onError: PropTypes.func,
    endpoint: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile(file) {
    const { onUpload, endpoint, onError } = this.props

    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
        .then(resp => {
          resp.json()
            .then(data => {
              if (resp.status >= 400) {
                return Promise.reject({ status: resp.status, data })
              }
              onUpload && onUpload(data)
            })
            .catch(({ data, status }) => {
              let error = Object.values(data).reduce(getFirstStringFromObject, '')
              onError && onError({ status, data, error })
            })
        })
        .catch(console.error)
    }
  }

  render() {
    const {
      onUpload,
      endpoint,
      children,
      className,
      ...other
    } = this.props

    return (
      <FileUploader
        {...other}
        classes={[className]}
        handleChange={this.uploadFile}
        hoverTitle=" "
      >
        {children}
      </FileUploader>
    )
  }
}

export default FileInput
