import PropTypes from 'prop-types';
import s from './ImageGalleryItem.module.css';

export default function ImageGalleryItem({
  webformatURL,
  description,
  onImageClick,
}) {
  return (
    <li className={s.galleryItem}>
      <img
        src={webformatURL}
        alt={description}
        className={s.galleryItemImage}
        onClick={onImageClick}
      />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired,
};
