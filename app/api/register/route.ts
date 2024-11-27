import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import db from "@/lib/prisma";
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { Role } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log('Starting registration API request'); // Debug log

  try {
    const body = await req.json();
    console.log('Received request body:', body); // Debug log

    const { email, password, name, role } = body;
    
    // Validate required fields
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!name) missingFields.push('name');
    if (!role) missingFields.push('role');

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields); // Debug log
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'ADMIN' && role !== 'SALES_REP') {
      console.log('Invalid role:', role); // Debug log
      return NextResponse.json(
        { error: `Invalid role selected: ${role}. Must be either 'ADMIN' or 'SALES_REP'` },
        { status: 400 }
      );
    }

    try {
      // Check if email exists
      console.log('Checking for existing user with email:', email); // Debug log
      const existingUser = await db.user.findUnique({
        where: {
          email: email
        }
      });

      if (existingUser) {
        console.log('User already exists with email:', email); // Debug log
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      console.log('Hashing password and generating verification token'); // Debug log
      const hashedPassword = await hash(password, 10);
      const verificationToken = randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const userData = {
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        verificationExpires,
        role: role as Role,
        ...(role === 'SALES_REP' && {
          salesRep: {
            create: {
              name,
              email,
              phone: "",
            }
          }
        })
      };

      console.log('Creating user with data:', { ...userData, password: '[REDACTED]' }); // Debug log
      const user = await db.user.create({
        data: userData
      });
      console.log('User created successfully:', { id: user.id, email: user.email, role: user.role }); // Debug log

      // Send verification email
      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
      
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not configured'); // Debug log
      }

      let emailSent = false;
      try {
        if (process.env.RESEND_API_KEY) {
          console.log('Sending verification email to:', email); // Debug log
          await resend.emails.send({
            from: 'AppAppoint <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email address',
            html: `
              <h2>Welcome to AppAppoint!</h2>
              <p>Please click the link below to verify your email address:</p>
              <a href="${verificationUrl}">Verify Email</a>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            `
          });
          emailSent = true;
          console.log('Verification email sent successfully'); // Debug log
        }
      } catch (emailError: any) {
        console.error('Failed to send verification email:', emailError);
        emailSent = false;
      }

      console.log('Registration process completed successfully'); // Debug log
      return NextResponse.json({
        message: "Registration successful",
        emailSent,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
        verificationStatus: {
          emailSent,
          message: emailSent 
            ? "Please check your email to verify your account" 
            : "Account created but verification email could not be sent. Please contact support.",
        }
      }, { status: 201 });
    } catch (dbError: any) {
      console.error('Database operation failed:', {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      });
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      error
    });
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
