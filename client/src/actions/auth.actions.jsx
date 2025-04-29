// Importing the custom axios instance and error handler utility
// Replace with relative paths
import axiosCustom from "../Services/AxiosConfig/axiosCustom";  // Use relative path
import catchAsync from "../Utils/CommonFunctions/catchAsync.jsx";  // Use relative path


/**
 * @endpoint 'auth/register'
 * @description API to register in movie share
 * @body {
 *          first_name: string,
 *          last_name: string,
 *          user_name: string,
 *          email: string,
 *          password: string,
 *          date_of_birth: string,
 *          gender: string
 *      }
 */
export const registerUserApi = catchAsync(async (values) => {
  try {
    console.log("Sending request to API with values:", values);  // Add logging before API call
    const data = await axiosCustom.post("auth/register", values);  // API request
    console.log("Received response:", data);  // Log the response data
    return data;
  } catch (error) {
    console.error("Error during API request:", error);  // Log any error during the request
    throw new Error(error.response?.data?.message || error.message);
  }
});

/**
 * @endpoint 'auth/login'
 * @description API to login with credentials
 * @body {
 *          "email": string,
 *          "password": string
 *      }
 */
export const logInApi = catchAsync(async (values) => {
  try {
    const data = await axiosCustom.post("auth/login", values);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
});

/**
 * @endpoint 'auth/social-login'
 * @description Social login with generated token from Google or Facebook
 * @body {
 *          type: string,
 *          token: string
 *      }
 */
export const socialLoginApi = catchAsync(async (value) => {
  try {
    const data = await axiosCustom.post("auth/social-login", value);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
});

/**
 * @endpoint 'auth/resend-link'
 * @description Verification email can be resent with this email address
 * @body {
 *          email: string
 *      }
 */
export const resendEmailVerifyApi = catchAsync(async (email) => {
  try {
    const data = await axiosCustom.post("auth/resend-link", { email });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
});

/**
 * @endpoint 'auth/forgot-password'
 * @description Initiate forgot password process with email address
 * @body {
 *          email: string
 *      }
 */
export const forgotPasswordApi = async (data) => {
  try {
    console.log("API call with data: ", data);

    // Use axiosCustom for the request
    const response = await axiosCustom.post("auth/forgot-password", data);

    console.log("API response: ", response.data); // Log the response
    return response.data; // Return only the data part of the response
  } catch (error) {
    console.error("Error in forgotPasswordApi:", error);
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

/**
 * @endpoint 'auth/email-verification'
 * @description After successful registration, this API allows the user to verify their email
 * @body {
 *          token: string
 *      }
 */
export const emailVerifyApi = catchAsync(async (id) => {
  try {
    const data = await axiosCustom.post("auth/email-verification", { token: id });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
});

/**
 * @endpoint 'auth/reset-password'
 * @description Reset password process with new password
 * @body {
 *          token: string;
 *          newPassword: string;
 *          confirmPassword: string;
 *      }
 */
export const resetPasswordApi = catchAsync(async (value) => {
  try {
    const data = await axiosCustom.post("/auth/reset-password", value); // Ensure correct endpoint format
    return data;
  } catch (error) {
    // Handle errors by throwing the relevant message from the error response
    throw new Error(error.response?.data?.message || error.message);
  }
});

/**
 * @endpoint 'auth/refresh-tokens'
 * @description Refresh tokens API
 * @body {
 *          token: string;
 *      }
 */
export const generateTokenApi = catchAsync(async (value) => {
  try {
    const data = await axiosCustom.post("auth/refresh-tokens", value);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
});
export const refreshTokenApi = async (refreshToken) => {
  const response = await apiClient.post("/auth/refresh-tokens", { refreshToken });
  return response.data;
};