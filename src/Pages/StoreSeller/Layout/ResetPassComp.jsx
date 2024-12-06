import { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { PasswordReset } from "../../../API/api";

const ResetPassComp = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { userId } = JSON.parse(localStorage.getItem("auth"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      let payload = {
        old_password: oldPassword,
        new_password: password,
      };

      let res = await PasswordReset(userId, payload);
      if (res?.response?.data?.error) {
        toast.error(res.response.data.message);
      } else {
        toast.success("Password reset successfully");
      }
    } else {
      setIsPasswordMatch(false);
    }
  };

  const togglePasswordVisibility = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <Container className="mt-5">
      <h4>Update Password</h4>
      <Row className="mt-3">
        <Col>
          <Form onSubmit={handleSubmit} className="mt-4">
            {/* Old Password */}
            <Row>
              <Col xs={8}>
                <Form.Group controlId="formOldPassword" className="position-relative">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y pe-3 mt-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility(setShowOldPassword)}
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </Form.Group>
              </Col>
            </Row>

            {/* New Password */}
            <Row>
              <Col xs={8}>
                <Form.Group controlId="formNewPassword" className="position-relative">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y pe-3 mt-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility(setShowNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </Form.Group>
              </Col>
            </Row>

            {/* Confirm Password */}
            <Row>
              <Col xs={8}>
                <Form.Group controlId="formConfirmPassword" className="position-relative">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {!isPasswordMatch && (
                    <Form.Text className="text-danger">
                      Passwords do not match.
                    </Form.Text>
                  )}
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y pe-3 mt-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-4">
              Update Password
            </Button>
          </Form>
        </Col>
        <Col xs={3} className="mb-5">
          <Image src="https://t4.ftcdn.net/jpg/04/20/32/53/360_F_420325313_0tgC68egfuhtzKf1OhVlZRHG6Dvv36Xt.jpg" />
        </Col>
      </Row>
      <Toaster position="top-right" />
    </Container>
  );
};

export default ResetPassComp;
