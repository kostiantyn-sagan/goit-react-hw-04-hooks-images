import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';
import s from './ImageGallery.module.css';
import pixabayAPI from '../../services/pixabay-api';
import ImageGalleryItem from '../ImageGalleryItem';
import Button from '../Button';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function ImageGallery({ query, onImageClick }) {
  const [images, setImages] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(1);

  const prevQuery = useRef(query);

  useEffect(() => {
    const isNewQuery = prevQuery.current !== query;

    if (!query || (!isNewQuery && page === 1)) {
      return;
    }

    if (isNewQuery) {
      setImages(null);
    }

    setStatus(Status.PENDING);

    pixabayAPI
      .fetchImages(query, isNewQuery ? 1 : page)
      .then(({ hits }) => {
        if (hits.length === 0) {
          return Promise.reject(
            new Error(
              `There are no images or photos for the search query ${query}`,
            ),
          );
        }

        setImages(images => (images ? [...images, ...hits] : hits));
        setStatus(Status.RESOLVED);

        if (isNewQuery) {
          setPage(1);
          prevQuery.current = query;
        }

        if (!isNewQuery && page >= 2) {
          window.scrollBy({
            top: document.documentElement.clientHeight - 166,
            behavior: 'smooth',
          });
        }
      })
      .catch(error => {
        setStatus(Status.REJECTED);
        toast.error(error.message);
      });
  }, [page, query]);

  if (status === Status.PENDING && page === 1) {
    return (
      <Loader
        type="ThreeDots"
        height={80}
        width={80}
        visible={true}
        style={{ textAlign: 'center' }}
      />
    );
  }

  return (
    <>
      {images && (
        <ul className={s.gallery}>
          {images.map(({ webformatURL, largeImageURL, tags }) => (
            <ImageGalleryItem
              key={webformatURL}
              webformatURL={webformatURL}
              description={tags}
              onImageClick={() => onImageClick(largeImageURL, tags)}
            />
          ))}
        </ul>
      )}
      {status === Status.RESOLVED && (
        <Button handleLoadMoreBtn={() => setPage(page => page + 1)} />
      )}
      {status === Status.PENDING && (
        <Loader
          type="ThreeDots"
          height={80}
          width={80}
          visible={true}
          style={{ textAlign: 'center' }}
        />
      )}
    </>
  );
}

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired,
};
