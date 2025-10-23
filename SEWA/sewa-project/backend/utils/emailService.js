import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "vp1246194@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Send email to admin when NGO/Hotel registers
export const sendAdminNotification = async (userType, userData, licensePath) => {
  try {
    const subject = `New ${userType} Registration - License Verification Required`;
    
    let htmlContent = `
      <h2>New ${userType} Registration</h2>
      <p>A new ${userType} has registered and requires license verification.</p>
      <br>
      <h3>Registration Details:</h3>
      <ul>
    `;

    if (userType === "NGO") {
      htmlContent += `
        <li><strong>Organization Name:</strong> ${userData.organizationName}</li>
        <li><strong>Contact Person:</strong> ${userData.contactPerson}</li>
        <li><strong>Email:</strong> ${userData.email}</li>
        <li><strong>Phone:</strong> ${userData.phone}</li>
        <li><strong>Address:</strong> ${userData.address}</li>
        <li><strong>City:</strong> ${userData.city}</li>
        <li><strong>License Number:</strong> ${userData.licenseNumber}</li>
      `;
    } else {
      htmlContent += `
        <li><strong>Hotel Name:</strong> ${userData.hotelName}</li>
        <li><strong>Manager Name:</strong> ${userData.managerName}</li>
        <li><strong>Email:</strong> ${userData.email}</li>
        <li><strong>Phone:</strong> ${userData.phone}</li>
        <li><strong>Address:</strong> ${userData.address}</li>
        <li><strong>City:</strong> ${userData.city}</li>
        <li><strong>License Number:</strong> ${userData.licenseNumber}</li>
      `;
    }

    htmlContent += `
      </ul>
      <br>
      <p><strong>License Document:</strong> ${licensePath ? 'Attached' : 'Not provided'}</p>
      <br>
      <p>Please review the license document and verify the registration through the admin panel.</p>
    `;

    const mailOptions = {
      from: "SEWA Admin <vp1246194@gmail.com>",
      to: "vp1246194@gmail.com",
      subject: subject,
      html: htmlContent,
      attachments: licensePath ? [{
        filename: `license_${userData.licenseNumber}.pdf`,
        path: licensePath
      }] : []
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent for ${userType} registration: ${userData.email}`);
  } catch (error) {
    console.error("Error sending admin notification:", error);
    throw error;
  }
};

// Send verification email to NGO/Hotel
export const sendVerificationEmail = async (userType, userData, action) => {
  try {
    const subject = action === "verify" 
      ? `Your ${userType} Registration has been Verified!` 
      : `Your ${userType} Registration has been Rejected`;

    const htmlContent = action === "verify" ? `
      <h2>Registration Verified!</h2>
      <p>Dear ${userType === "NGO" ? userData.contactPerson : userData.managerName},</p>
      <p>Congratulations! Your ${userType} registration has been successfully verified.</p>
      <br>
      <p><strong>Organization Details:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${userType === "NGO" ? userData.organizationName : userData.hotelName}</li>
        <li><strong>Email:</strong> ${userData.email}</li>
        <li><strong>License Number:</strong> ${userData.licenseNumber}</li>
      </ul>
      <br>
      <p>You can now log in to your account and start using our platform.</p>
      <p>Thank you for joining SEWA!</p>
    ` : `
      <h2>Registration Rejected</h2>
      <p>Dear ${userType === "NGO" ? userData.contactPerson : userData.managerName},</p>
      <p>We regret to inform you that your ${userType} registration has been rejected.</p>
      <br>
      <p>Please review your license document and registration details. You may re-register with correct information.</p>
      <p>If you have any questions, please contact our support team.</p>
    `;

    const mailOptions = {
      from: "SEWA Admin <vp1246194@gmail.com>",
      to: userData.email,
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${userType}: ${userData.email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export default transporter;
