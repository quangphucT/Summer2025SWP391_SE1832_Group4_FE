import { Button, Modal } from "antd";

const PopUpNotiThroughEmail = ({ isModalVisible, setIsModalVisible }) => {
  return (
    <Modal
      title={
        <div className="text-red-700 font-bold text-xl">
          Almost there!
        </div>
      }
      open={isModalVisible}
      footer={
        [
            <Button onClick={() => {setIsModalVisible(false)}}>Got it!</Button>,
        ]
      }
      onCancel={() => {setIsModalVisible(false)}}
      okText="Got it"
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{
        className: "bg-red-700 hover:bg-red-800 border-red-700 font-semibold rounded"
      }}
      bodyStyle={{ padding: '1.5rem 2rem' }} // padding cho body modal
      centered
    >
      <p className="text-red-600 text-base font-medium">
        Please check your email to set your password and activate your account.
      </p>
    </Modal>
  );
};

export default PopUpNotiThroughEmail;
