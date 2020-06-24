import React from 'react'
import { Upload, Icon, Modal } from 'antd';
import { reqdelImage } from '../../api/index'
// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  componentWillReceiveProps(nextProps) {
    this.getUpdateImages(nextProps)
  }
  // componentDidMount() {
  //   this.getUpdateImages()
  // }

  //删除图片
  handleCancel = () => this.setState({ previewVisible: false });

  //放大图片
  handlePreview = async file => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }

    // this.setState({
    //   previewImage: file.url || file.preview,
    //   previewVisible: true,
    // });
  };
  
  //当file状态改变触发
  handleChange = async ({ file, fileList }) => {
      
    if (file.status === 'done') {
        //上传成功
        //获取后台返回的数据
        file = fileList[fileList.length - 1]
        const {name, url} = file.response.data
        
        // 保存到上传对象中
        file.name = name
        file.url = url 
    }else if(file.status === 'removed') {
        //获取要删除的文件名
        let delName = file.url.substr(file.url.lastIndexOf('/') + 1)
        const result = await reqdelImage(delName)

    }
    this.setState({ fileList })
  }

  //获取所有已上传文件的数组
  getImgs = () => this.state.fileList.map(file => file.url.substr(file.url.lastIndexOf('/') + 1))

  //获取要修改的商品的图片
  getUpdateImages = (nextProps) => {
    const { images } = nextProps
    if (images) {
      let files = []
      images.map( item => {
        let data = {
          status: 'done',
          url: item,
          uid: item
        }
        files.push(data)
      })
      this.setState({ fileList: files })
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">图片上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
