// LoginData
export const LoginData = {
    email: String,
    password: String,
  };
  
  // RegisterApiData
  export const RegisterApiData = {
    first_name: String,
    last_name: String,
    user_name: String,
    email: String,
    password: String,
    date_of_birth: Date,
    gender: String,
    confirm_password: String, // Optional in JS, you can skip if not needed
  };
  
  // ResetPasswordApiData
  export const ResetPasswordApiData = {
    token: String,
    newPassword: String,
  };
  
  // SocialLoginType
  export const SocialLoginType = {
    type: String,
    token: String,
  };
  
  // IRefreshToken
  export const IRefreshToken = {
    token: String,
  };
  
  // IUserDetails (Login Response Types)
  export const IUserDetails = {
    _id: String,
    first_name: String,
    last_name: String,
    user_name: String,
    email: String,
    date_of_birth: Date,
    gender: String,
    signup_by: String,
    profile_picture: String,
    is_active: Boolean,
    is_deleted: Boolean,
    is_accept_term_condition: Boolean,
    is_email_verified: Boolean,
    account_type: String,
    is_account_private: Boolean,
    is_show_followers: Boolean,
    is_show_friends: Boolean,
    is_show_likes: Boolean,
    is_live: Boolean,
    is_banned: Boolean,
    role: String,
    last_login_time: Date,
    banned_start_time: Date,
    created_at: Date,
    updated_at: Date,
    verify_token: String,
    token: String,
  };
  
  // ILoginResponse
  export const ILoginResponse = {
    status: Boolean,
    message: String,
    result: {
      is_email_verified: Boolean,
      userData: IUserDetails,
      tokens: {
        access: {
          expires: Date,
          token: String,
        },
        refresh: {
          expires: Date,
          token: String,
        },
      },
    },
  };
  
  // ISignUpResponse
  export const ISignUpResponse = {
    status: Boolean,
    message: String,
  };
  