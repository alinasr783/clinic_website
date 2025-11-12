import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from "../../components/Button";

const DEFAULT_CREDENTIALS = {
  email: "admin@clinic.com",
  password: "admin123",
};

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (
        formData.email === DEFAULT_CREDENTIALS.email &&
        formData.password === DEFAULT_CREDENTIALS.password
      ) {
        localStorage.setItem("isAuthenticated", "true");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        navigate("/dashboard");
      } else {
        setErrors({
          general: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-2 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
        Login
      </h2>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-gray-900">
        <p className="font-semibold mb-1">Default login credentials:</p>
        <p>Email: {DEFAULT_CREDENTIALS.email}</p>
        <p>Password: {DEFAULT_CREDENTIALS.password}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            variation="primary"
            disabled={isLoading}
            className="w-full">
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
