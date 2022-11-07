import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { FileUploader } from 'react-drag-drop-files'


class FileInput extends PureComponent {
  static propTypes = {
    onUpload: PropTypes.func,
    endpoint: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile(file) {
    const { onUpload, endpoint } = this.props

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
              onUpload && onUpload(data)
            })
            .catch(console.error)
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
      >
        {children}
      </FileUploader>
    )
  }
}

export default FileInput
