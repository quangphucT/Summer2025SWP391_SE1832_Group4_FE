
import { Modal, Form, Input, Button } from 'antd';

const ModalDynamic = ({ openModal, setOpenModal,formModal,loading,handleSubmit,titleModal, formItem }) => {
  const [form] = Form.useForm();


  return (
       <Modal
      title={<h2 className="text-xl font-bold text-center">{titleModal}</h2>}
      open={openModal}
      onCancel={() => {setOpenModal(false); form.resetFields()}}
     footer={[
          <Button onClick={() => {setOpenModal(false); formModal.resetFields()}}>Cancel</Button>,
          <Button loading={loading} onClick={() => {formModal.submit()}}>Save</Button>
        ]}
      centered
    >
      <Form
        form={formModal}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4 space-y-4"
      >

        {formItem}

        

  

       
      </Form>
    </Modal>
  );
};

export default ModalDynamic;


