import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea, Flex, FormHelperText } from "@chakra-ui/react";

interface FormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    handleInquire: () => void;
    formData: {
      name: string;
      number: string;
      email: string;
      address: string;
      serviceInfo: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }

  const initialFormData = {
    name: '',
    number: '',
    email: '',
    address: '',
    serviceInfo: '',
  }

const FormModal: React.FC<FormModalProps> = ({isOpen, closeModal, handleInquire, formData = initialFormData, handleInputChange}) => {
    return (
        <Modal isOpen={isOpen} onClose={closeModal} size="lg">
                {/* <ModalCloseButton />  */}
        <ModalBody className="p-0">
            {isOpen && (
              <div className='fixed inset-0 p-0 flex items-center justify-center bg-black bg-opacity-75'>
                <div className='bg-white p-8 w-full max-w-md'>
                    <h2 className='text-2xl font-semibold mb-4 text-black text-center'>Inquire About Services</h2>
      
                    <FormControl mb={4}>
                      <FormLabel htmlFor='name' className='text-sm font-medium text-gray-700'>
                        Name
                      </FormLabel>
                      <Input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Name'
                        maxLength={255}
                        value={formData.name}
                        onChange={handleInputChange}
                        className='mt-1 p-2 w-full border text-black rounded-md'
                        required
                      />
                      <FormHelperText color="gray.500">Your full name</FormHelperText>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel htmlFor='number' className='text-sm font-medium text-gray-700'>
                        Phone Number
                      </FormLabel>
                      <Input
                        type='tel'
                        id='number'
                        name='number'
                        placeholder='123-456-7890'
                        maxLength={12}
                        value={formData.number}
                        onChange={handleInputChange}
                        className='mt-1 p-2 w-full border text-black rounded-md'
                        required
                      />
                      <FormHelperText color="gray.500">Your phone number</FormHelperText>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel htmlFor='email' className='text-sm font-medium text-gray-700'>
                        Email
                      </FormLabel>
                      <Input
                        type='text'
                        id='email'
                        name='email'
                        placeholder='example@example.com'
                        maxLength={255}
                        value={formData.email}
                        onChange={handleInputChange}
                        className='mt-1 p-2 w-full border text-black rounded-md'
                        required
                      />
                      <FormHelperText color="gray.500">Your email address</FormHelperText>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel htmlFor='address' className='text-sm font-medium text-gray-700'>
                        Address
                      </FormLabel>
                      <Input
                        type='text'
                        id='address'
                        name='address'
                        placeholder='123 Mary Lane, Seattle WA, 99999'
                        maxLength={255}
                        value={formData.address}
                        onChange={handleInputChange}
                        className='mt-1 p-2 w-full border text-black rounded-md'
                        required
                      />
                      <FormHelperText color="gray.500">Your full address</FormHelperText>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel htmlFor='serviceInfo' className='text-sm font-medium text-gray-700'>
                        Service Request
                      </FormLabel>
                      <Textarea
                        id='serviceInfo'
                        name='serviceInfo'
                        value={formData.serviceInfo}
                        onChange={handleInputChange}
                        className='mt-1 p-2 w-full border text-black rounded-md'
                        rows={4}
                        required
                      />
                      <FormHelperText color="gray.500">Describe your service request</FormHelperText>
                    </FormControl>

                    <Flex justify='end'>
                      <Button
                        type='button'
                        onClick={closeModal}
                        className='bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2 mr-2'
                      >
                        Cancel
                      </Button>
                      <Button
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
                      </Button>
                    </Flex>
                </div>
              </div>
            )}
      </ModalBody>
    </Modal>
    )
}

export default FormModal

