import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ImageGallery from './components/ImageGallery';
import Modal from './components/Modal';
import Searchbar from './components/Searchbar';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [selectedImageDescr, setSelectedImageDescr] = useState(null);

  const toggleModal = () => {
    setShowModal(state => !state);
  };

  const showSelectedImage = (url, descr) => {
    setSelectedImageURL(url);
    setSelectedImageDescr(descr);
    toggleModal();
  };

  return (
    <div className="App">
      <Searchbar onSubmit={setQuery} />
      <ImageGallery query={query} onImageClick={showSelectedImage} />
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={selectedImageURL} alt={selectedImageDescr} />
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
}
