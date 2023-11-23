import React, {FC} from 'react'


interface ImageCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const  ImageCreateModal: FC<ImageCreateModalProps> = ({isOpen, onClose}) => {
  return (
    <div>
      <div>
        <h2>이미지 묘사</h2>
        <input type="text" placeholder='원하는 의상이나 동작, 배경을 입력해보세요.' />
      </div>
      <div>
        <h2>이미지 사이즈</h2>
        <label htmlFor="Width">Width : </label>
        <input type="text" name='Width' />
        <label htmlFor="Heghit">Heghit : </label>
        <input type="text" name="Heghit"/>
      </div>
      <button>이미지 생성</button>
    </div>
  )
}

export default ImageCreateModal