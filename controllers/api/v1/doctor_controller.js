
const Doctor=require('../../../models/doctorModel');
const jwt=require('jsonwebtoken');

//  Doctor Registration
module.exports.register = async function(req,res) {
  try {

    const doctor=  await Doctor.create(req.body);
       // If Doctor registration is successful
      return res.status(200).json({
          success: true,
          message:doctor
      });

  } catch (err) { // Error Handling 
      return res.status(500).json({
          success: false,
          message:err.message
      });
  }
}

//  Doctor Signing In
module.exports.login= async (req, res)=>{
  try {

    let { email, password } = req.body;

    if (!email || !password) {
       // If email or password are not entered 
      return res.status(400).json({ 
        success: false,
        msg:'No email or Password'
      });
    }

    let doctor = await Doctor.findOne({ email: email });
    if (!doctor) { 
      // If Doctor not found 
      return res.status(401).json({ 
        success: false, 
        msg: "Invalid Username / Password!" 
      });
    }

    // Checking if the passwords matches 
    const isMatch = await doctor.matchPassword(password);
    // Invalid Password - Error Handling 
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        msg: "Invalid Username / Password!" 
      });
    }

    //Getting the JWT Token 
    const token = doctor.getSignedJwtToken();

    // Return Response 200
    res.status(200).json({
      success: true,
      token,
      msg: `Welcome Dear ${doctor.username} ! Log In Sucessful!Please keep Token!`
    });

  } catch (error) {
     //  Error Handling
    console.log(error);
    res.status(400).json({
      success: false,
      msg:'Error Occoured!'
    });
  }
}
