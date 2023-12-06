// app/api/sendEmail.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('API route hit'); // Add this line
  if (req.method === 'POST') {
    const { name, number, email, address, serviceInfo } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${email}`,
      to: process.env.EMAIL_USER,
      subject: 'New Inquiry from M.A. Handyman Services',
      html: `
        <p>Name: ${name}</p>
        <p>Phone Number: ${number}</p>
        <p>Email: ${email}</p>
        <p>Address: ${address}</p>
        <p>Service Request: ${serviceInfo}</p>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
