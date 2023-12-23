const { MessageWay, isMessageWayError } = require('messageway');
const User = require('./../app/Models/User');

const message = new MessageWay('229e3aa8b0c9f017913c618d26dcd0e9');


const sendCode = async(mobile) => {

    try {
      const referenceID = await message.sendSMS({
        mobile: mobile,
        templateID: 9,
        length: 5,
        expireTime : 60
      });

      return referenceID;
      
    } catch (error) {  
      if (error.code === 'ENOTFOUND') {
        // خطا در اتصال به اینترنت
        throw new Error('Unable to connect to the internet. Please check your internet connection.');
      }
  
      // خطای دیگر
      throw error;
    }
  };
  


  const getStatus = async (otpId) => {
  
    try {
      const result = await message.getStatus({ OTPReferenceID: otpId })
      return {
        method: result.OTPMethod,
        status: result.OTPStatus,
        verified: result.OTPVerified,
      };
    } catch (error) {
      if (isMessageWayError(error)) {
        return error;
      } else {
        return error;
      }
    }
  }



  const checkVerifyCode = async (phoneNumber, code) => {
    const otp = new MessageWay('229e3aa8b0c9f017913c618d26dcd0e9');
  
    try {
      await otp.verify({ mobile: phoneNumber, otp: code });
      console.log('Code is correct!');
      const user = await User.findOne({ phoneNumber: phoneNumber });

      if (user) {
        user.isVerified = true;
        const token = await user.generateToken();
        await user.save();

        return {
          message: 'Code is correct!',
          user: {
            token: token,
          },
        };
      }
    } catch (error) {
      // handle Error
      if (isMessageWayError(error)) {
        console.log(`Error ${error.code}: ${error.message}`);
        error.message = `${error.code}: ${error.message}`;
        throw error; // ارتفاع خطا به بالا برای catch بعدی
      } else {
        // unknown error
        console.error(error);
        return error;
      }
    }
  };
  


  


 

    

    // try {
    //   const result = await otp.verify({
    //     mobile: phoneNumber,
    //     otp: code,
    //   });

    //   console.log(result);
  
    //   if (result) {
    //     const updatedUser = await User.findOneAndUpdate(
    //       { phoneNumber: phoneNumber },
    //       { $set: { isVerified: true } },
    //       { new: true }
    //     );
  
    //     if (updatedUser) {
    //       return { message: 'User is verified successfully.', token: updatedUser.token };
    //     } else {
    //       return { message: 'User not found.' };
    //     }
    //   } else {
    //     return { error: 'Verification failed.' };
    //   }
    // } catch (error) {
    //   if (isMessageWayError(error)) {
    //     return { error: error.message };
    //   } else {
    //     return { error: 'Internal Server Error' };
    //   }
    // }
  // };

  //   // try{

  //     const mm = await message.verify({
  //       mobile: phoneNumber,
  //       otp: code,
  //     })

  //     console.log(mm);

      // const user = await User.findOne({phoneNumber : phoneNumber});
    //   console.log(user);

      // const user = await User.findOneAndUpdate({ phoneNumber: mobile }, { $set: { isVerified: true }}, { new: true });

    //   // console.log(user);

      // if (user) {
      //   return {
      //     message: 'Registration was successful!',
      //     user: {
      //       token: user.token,
      //       isVerified: user.isVerified,
      //     },
      //   };
      // }else{
      //   console.log('kkk');
      // }
    
    // }catch(error){
    //   if (isMessageWayError(error)) {
    //     return {
    //       code: error.code,
    //       message: error.message,
    //     };
    //   } else {
    //     console.log('kk');
    //     return error;
      // }
    // }
  // };





module.exports = {sendCode, getStatus, checkVerifyCode};