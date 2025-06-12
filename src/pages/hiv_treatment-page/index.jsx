import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Checkbox,
  Button,
  Row,
  Col,
} from "antd";
import SubCarousel from "../../components/subcarousel-hivTreatment";
import imageAboveForm from '../../assets/images/virus.png'

const HTreatmentPage = () => {
  const onFinish = (values) => {
    console.log("Submitted values:", values);
  };

  return (
    <div className="max-h-full pb-5 mt-[78px] bg-[#f4f6f8]">
      {/* Banner Section */}
      <SubCarousel />

      <div className="flex flex-row max-w-7xl mx-auto mt-8 gap-8">
        {/* Left Content Section */}
        <div className="w-2/3">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-[#1e88e5] mb-6 border-b-2 border-[#e0e0e0] pb-3">
              HIV Testing Information
            </h1>

            {/* Purpose */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1e88e5] mb-3">
                Purpose of Testing
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Early HIV screening (21 days after exposure).</li>
                <li>Detect HIV infection in early stages.</li>
              </ul>
            </div>

            {/* Target Groups */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1e88e5] mb-3">
                Who Should Get Tested
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>People with STDs or related symptoms.</li>
                <li>
                  Individuals with multiple or unprotected sexual partners.
                </li>
                <li>
                  People who use injectable drugs or haven't had regular
                  checkups.
                </li>
                <li>Men who have sex with men (MSM).</li>
                <li>Children born to HIV-positive mothers.</li>
                <li>Pregnant women.</li>
              </ul>
            </div>

            {/* Sample Type */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1e88e5] mb-3">
                Blood Sample Type
              </h2>
              <p className="text-gray-700">Venous blood sample.</p>
            </div>

            {/* Result Time */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1e88e5] mb-3">
                Result Time
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Results available in 30 minutes.</li>
              </ul>
            </div>

            {/* Fasting Requirement */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1e88e5] mb-3">
                Fasting Requirement
              </h2>
              <p className="text-gray-700">
                No fasting required before testing.
              </p>
            </div>

            {/* Why Choose This Service */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1e88e5] mb-3">
                Why Choose HIV TREATMENT
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Private clinics covered by health insurance.</li>
                <li>Licensed to provide HIV confirmatory testing.</li>
                <li>Strict confidentiality of health information.</li>
                <li>Private, clean consultation rooms.</li>
                <li>Free HIV prevention and treatment consultation.</li>
                <li>
                  Friendly, dedicated, responsible, and professional staff.
                </li>
                <li>24/7 community support and counseling available.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-center mb-4">
            <img
              src={imageAboveForm} // Đường dẫn đến hình ảnh của bạn
              alt="Doctor consultation"
              className="w-50 h-50"
            />
          </div>
          <h2 className="text-xl font-semibold text-[#1e88e5] mb-4 text-center">
            Appointment Registration
          </h2>
          <Form layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input placeholder="John Doe" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                >
                  <Input placeholder="0123456789" className="rounded-md" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Appointment Date"
                  name="date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker
                    className="w-full rounded-md"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Appointment Time"
                  name="time"
                  rules={[{ required: true, message: "Please select a time" }]}
                >
                  <TimePicker className="w-full rounded-md" format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Service"
              name="service"
              rules={[{ required: true, message: "Please choose a service" }]}
            >
              <Select placeholder="Select a service" className="rounded-md">
                <Select.Option value="hiv_testing">HIV Testing</Select.Option>
                <Select.Option value="consultation">
                  Testing for STDs
                </Select.Option>
                <Select.Option value="consultation">
                  HIV Treatment
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Doctor"
              name="doctor"
              rules={[{ required: true, message: "Please select a doctor" }]}
            >
              <Select placeholder="Select a doctor" className="rounded-md">
                <Select.Option value="dr_john">Dr. John</Select.Option>
                <Select.Option value="dr_anna">Dr. Anna</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="anonymous" valuePropName="checked">
              <Checkbox className="text-gray-700">
                Register Anonymously
              </Checkbox>
            </Form.Item>

            <Form.Item label="Notes" name="notes">
              <Input.TextArea
                rows={3}
                placeholder="Additional notes (if any)"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{width:'100%', height: '45px', background: '#1e88e5', fontWeight: '700', fontSize: '16px'}}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>


      </div>



    </div>
  );
};

export default HTreatmentPage;
