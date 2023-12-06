import Image from 'next/image'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import Footer from './footer';
import FormModal from './formModal';
import Head from 'next/head';
import AlertModal from './alertModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
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
      email: '',
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
        closeModal();
      } else {
        console.error('Error sending email');
        setEmailStatus('error')
        console.log(emailStatus)
        setAlertOpen(true)
      }
    } catch (error) {
      console.error('Error sending email', error);
      setEmailStatus('error')
      console.log(emailStatus)
      setAlertOpen(true)
    }
    console.log('Form Data:', formData);
    closeModal();
  };

  useEffect(() => {
    if (emailStatus === "success" || emailStatus === "error") {
      openAlert();
    }
  }, [emailStatus]);

  const [isMobile] = useMediaQuery("(max-width: 767px)");


  return (
    <>
    <Head>
      <title>M.A Handyman Services</title>
    </Head>
    <div className='bg-slate-700 flex flex-col items-center justify-center px-4 md:px-24 pt-16 md:pt-20'>
        <Text fontSize={isMobile ? "3xl" : "4xl"} fontWeight="semibold">M.A. Handyman Services</Text>
        <Text fontSize={isMobile ? "xl" : "2xl"}>Servicing Kirkland, WA</Text>
      </div>
      <div className={isMobile ? 'bg-slate-700 flex flex-col items-center justify-center pt-8' : 'bg-slate-700 flex flex-col md:flex-row items-center justify-center text-center -mt-16 md:-mt-32 h-screen w-screen'}>
        <Box className={isMobile ? 'mb-8' : 'flex items-center justify-center h-1/2 w-1/2 ml-40 mr-4'}>
          <Image src='/main.jpeg' alt='Handyman Services' width={isMobile ? 500 : 600} height={isMobile ? 400 : 500} />
        </Box>
        <Box className={isMobile ? 'mb-8 text-center px-4' : 'h-1/2 w-1/2 flex flex-col items-center justify-center ml-4 mr-40'}>
          <Text fontSize={isMobile ? "lg" : "2xl"} className='mt-4'>
            M.A. Handyman Services is your trusted local partner for all your home repair and improvement needs in Kirkland, WA. I am dedicated to delivering high-quality craftsmanship and excellent customer service. Whether it's fixing a leaky faucet or painting a room, I am here to help make your home the best it can be.
          </Text>
          <Text fontSize={isMobile ? "xl" : "2xl"} py={4} pt={12}>Please submit your request to inquire about services!</Text>
          <Button onClick={openModal} className='bg-black text-white rounded p-2 px-8 m-2 hover:bg-white hover:text-black transition duration-500 ease-in-out'>Inquire</Button>
        </Box>
      </div>
      <Footer />
      <AlertModal isOpen={alertOpen} onClose={closeAlert} closeAlert={closeAlert} emailStatus={emailStatus} />
      <FormModal isOpen={isModalOpen} closeModal={closeModal} handleInquire={handleInquire} formData={formData} handleInputChange={handleInputChange} />
    </>
  )
}