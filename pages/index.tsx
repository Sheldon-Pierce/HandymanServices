import Image from 'next/image'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { useEffect, useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    address: '',
    serviceInfo: '',
  });

  const [emailStatus, setEmailStatus] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openAlert = () => {
    setAlertOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // You can optionally reset the form data here
    setFormData({
      name: '',
      number: '',
      address: '',
      serviceInfo: '',
    });
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInquire = async () => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Email sent successfully');
        setEmailStatus("success");
        console.log(emailStatus)
        setAlertOpen(true)
        // Optionally, you can close the modal or show a success message here
        closeModal();
      } else {
        console.error('Error sending email');
        setEmailStatus('error')
        console.log(emailStatus)
        setAlertOpen(true)
        // Handle the error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error sending email', error);
      setEmailStatus('error')
      console.log(emailStatus)
      setAlertOpen(true)
      // Handle the error, e.g., show an error message to the user
    }
    console.log('Form Data:', formData);
    closeModal();
  };

  useEffect(() => {
    // Open the modal for success or error
    if (emailStatus === "success" || emailStatus === "error") {
      openAlert();
    }
  }, [emailStatus]);

  return (
    <>
    <div className='bg-slate-700 flex flex-col items-center justify-center px-24 pt-20'>
      <h1 className='text-4xl semibold'>M.A. Handyman Services</h1>
      <h5 className='text-2xl'>Servicing Kirkland, WA</h5>
    </div>
    <div className='bg-slate-700 flex items-center justify-center -mt-32 h-screen w-screen'>
      <div className='flex items-center justify-center h-1/2 w-1/2 ml-40 mr-4'>
        <Image src='/main.jpeg' alt='Handyman Services' width={600} height={500} />
      </div>
      <div className='h-1/2 w-1/2 flex flex-col items-center justify-center ml-4 mr-40 '>
        <p className='text-lg md:text-2xl sm:text 1xl mt-4'>
          M.A. Handyman Services is your trusted local partner for all your home repair and improvement needs in Kirkland, WA. I am dedicated to delivering high-quality craftsmanship and excellent customer service. Whether it's fixing a leaky faucet or painting a room, I am here to help make your home the best it can be.
        </p>
        <p className='text-2xl py-4 pt-12'>Please submit your request to inquire about services!</p>
        <button onClick={openModal} className='bg-black text-white rounded p-2 px-8 m-2 hover:bg-white hover:text-black transistion duration-500 ease-in-out '> Inquire </button>
      </div>
    </div>

    {/* Alert Modal */}
    <Modal isOpen={alertOpen} onClose={closeAlert} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{emailStatus === "success" ? "Success!" : "Error!"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {emailStatus === "success" ? (
            <p>Email sent successfully.</p>
          ) : (
            <p>There was an error sending the email. Please try again.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={closeAlert}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* Form Modal */}
    {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-white p-8 w-full max-w-md'>
            <h2 className='text-2xl font-semibold mb-4 text-black text-center'>Inquire About Services</h2>
            <form>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='mt-1 p-2 w-full border text-black rounded-md'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='number' className='block text-sm font-medium text-gray-700'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  id='number'
                  name='number'
                  value={formData.number}
                  onChange={handleInputChange}
                  className='mt-1 p-2 w-full border text-black rounded-md'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                  Address
                </label>
                <input
                  type='text'
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  className='mt-1 p-2 w-full border text-black rounded-md'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='serviceInfo' className='block text-sm font-medium text-gray-700'>
                  Service Request
                </label>
                <textarea
                  id='serviceInfo'
                  name='serviceInfo'
                  value={formData.serviceInfo}
                  onChange={handleInputChange}
                  className='mt-1 p-2 w-full border text-black rounded-md'
                  rows='4'
                  required
                ></textarea>
              </div>
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2 mr-2'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleInquire}
                  className={`bg-black hover:bg-gray-800 text-white rounded-md px-4 py-2 ${
                    // Add the 'disabled' class when any of the fields is empty
                    !formData.name || !formData.number || !formData.address || !formData.serviceInfo
                      ? 'disabled'
                      : ''
                  }`}
                  // Disable the button when any of the fields is empty
                  disabled={!formData.name || !formData.number || !formData.address || !formData.serviceInfo}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}