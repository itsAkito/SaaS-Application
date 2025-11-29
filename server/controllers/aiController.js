import { v2 as cloudinary } from 'cloudinary';
import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";
import FormData from 'form-data';
import fetch from "node-fetch"; // If you're using Node.js <18, install this
import pdf from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs';
import axios from "axios";
// import { GoogleGenAI } from '@google/genai';
import OpenAI from "openai";

// import { uploadTocloudinary } from '../configs/cloudinary.js'
import { uploadToCloudinary } from '../configs/cloudinary.js';
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length, type = "article" } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        // ✅ Validate input
        if (!prompt || prompt.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message: "Prompt must be at least 20 characters long.",
            });
        }

        if (!length || typeof length !== "number" || length < 50) {
            return res.status(400).json({
                success: false,
                message: "Length must be a number greater than 50.",
            });
        }

        // ✅ Check usage limit
        if (plan !== "premium" && free_usage >= 60) {
            return res.status(403).json({
                success: false,
                message: "Limit reached. Upgrade to continue.",
            });
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash", // Use a supported model identifier
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content.trim();
        if (!content) {
            return res.status(500).json({
                success: false,
                message: "AI response was empty or malformed.",
            });
        }

        // ✅ Save to DB
        await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, ${type})
    `;

        // ✅ Update usage
        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                },
            });
        }

        res.json({ success: true, content });
    } catch (error) {
        console.error("generateArticle error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length, type = 'blog-title' } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        // ✅ Validate input
        if (!prompt || prompt.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message: "Prompt must be at least 20 characters long.",
            });
        }

        if (!length || typeof length !== "number" || length < 30) {
            return res.status(400).json({
                success: false,
                message: "Length must be a number greater than 30.",
            });
        }

        // ✅ Check usage limit
        if (plan !== "premium" && free_usage >= 60) {
            return res.status(403).json({
                success: false,
                message: "this feature is only availabe chances which is 50 for every user.",
            });
        }
        // ✅ Call Gemini API
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash", // Use a supported model identifier
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content =
            response?.choices?.[0]?.message?.content?.trim() || null;
        // console.log("Gemini raw response:", JSON.stringify(response, null, 2));

        if (!content) {
            return res.status(500).json({
                success: false,
                message: "AI response was empty or malformed.",
            });
        }


        // ✅ Save to DB
        await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, ${type})
    `;

        // ✅ Update usage
        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                },
            });
        }

        res.json({ success: true, content });
    } catch (error) {
        console.error("generateBlogTitle error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, type = "image", publish = false } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        // ✅ Validate input
        if (!prompt || prompt.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Prompt must be at least 10 characters long.",
            });
        }
        // ✅ Check usage limit
        if (plan !== "premium" && free_usage >= 60) {
            return res.status(403).json({
                success: false,
                message: "If limit reached.You need to Upgrade for continue further.",
            });
        }
        const formData = new FormData();
        formData.append('prompt', prompt)
        const imageRes = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: { 'x-api-key': process.env.CLIPDROP_API_KEY, },
            responseType: "arraybuffer",
        })


        const base64Image = `data:image/png;base64,${Buffer.from(imageRes.data, 'binary').toString('base64')}`;
        const { secure_url } = await cloudinary.uploader.upload(base64Image);


        // ✅ Save to DB
        await sql`
      INSERT INTO creations (user_id, prompt, content, type,publish)
      VALUES (${userId}, ${prompt}, ${secure_url},${type},${publish})
    `;
        // ✅ Update usage
        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                },
            });
        }
        res.json({
            success: true,
            prompt,
            image_url: secure_url
        });

        // res.json({ success: true, content });
    } catch (error) {
        console.error("generateImage error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};


import streamifier from 'streamifier';

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { type = "image" } = req.body;
        const image = req.file;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (!image || !image.buffer) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded or image buffer missing.",
            });
        }

        if (plan !== "premium" && free_usage >= 35) {
            return res.status(403).json({
                success: false,
                message: "Free usage limit reached. Upgrade to premium for unlimited access.",
            });
        }

        // ✅ Upload buffer to Cloudinary using stream
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        transformation: [
                            {
                                effect: "background_removal",
                                background_removal: "remove_the_background",
                            },
                        ],
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(image.buffer).pipe(stream);
            });
        };

        const result = await streamUpload();

        // ✅ Save to DB
        await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${result}, ${type})
    `;

        // ✅ Update usage
        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                },
            });
        }

        res.json({ success: true, content: result });
    } catch (error) {
        console.error("removeImageBackground error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};
export const removeObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { type = "image", object } = req.body;
        const image = req.file

        const plan = req.plan;
        const free_usage = req.free_usage;
        if (!object || object.trim().split(' ').length > 1) {
            return res.status(400).json({
                success: false,
                message: "please provide a single object name to remove."
            });

        }
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded.",
            });
        }
        // ✅ Check usage limit
        if (plan !== "premium" && free_usage >= 60) {
            return res.status(403).json({
                success: false,
                message: "In this feature availabe chances alreay used by you. which is 50 for every user.",
            });
        }
        const stream = await uploadToCloudinary(req.file.buffer, "uploads")
        const public_id = stream.public_id

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{
                effect: `gen_remove:${object}`
            }],
            resource_type: 'image',
        })
        // res.json(result);

        // ✅ Save to DB
        await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, ${type})
    `;
        // ✅ Update usage
        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                },
            });
        }

        res.json({ success: true, content: imageUrl });
    } catch (error) {
        console.error("generate the image with removeObject:", error)
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};

export const reviewResume = async (req, res) => {
    try {
        const { userId } = req.auth?.() || {};
        const { length = 300, type = "review-resume" } = req.body;
        const resume = req.file;
        const plan = req.plan;
        const free_usage = req.free_usage;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access." });
        }
        if (!resume) {
            return res.status(400).json({ success: false, message: "No resume file uploaded." });
        }
        if (resume.size > 5 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: "Resume file size should be less than (5MB)." });
        }
        // ✅ Check usage limit
        if (plan !== "premium" && free_usage >= 60) {
            return res.status(403).json({
                success: false,
                message: "this feature is only availabe chances which is 60 for every user.",
            });
        }

        let pdfData;
        try {
            if (!resume || !resume.buffer) {
                throw new Error("Resume file buffer is missing.");
            }
            pdfData = await pdf(resume.buffer);
        }
        catch (error) {
            console.error("PDF parsing error")
            throw new Error("failed to read parse resume pdf")
        }
        const prompt = `Review the following resume and provide constructive 
feedback on its strengths,weaknesses ,and Resume Content:\n\n${pdfData.text}`;


        // ✅ Call Gemini API
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash", // Use a supported model identifier
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content =
            response?.choices?.[0]?.message?.content || response?.choices?.[0]?.text || null;
        // const content = geminiRes.choices[0].message.text
        console.log("Gemini response:", JSON.stringify(response, null, 2));

        if (!content || typeof content !== "string") {
            throw new Error("No valid content to save.");
        }
        // ✅ Save to DB
        await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${'Review the uploaded resume'}, ${content}, ${type})
    `;

        // ✅ Update usage
        try {
            if (plan !== "premium") {
                await clerkClient.users.updateUserMetadata(userId, {
                    privateMetadata: {
                        free_usage: free_usage + 1,
                    },
                });
            }
        }
        catch (error) {
            console.warn(error.message)

        }

        res.json({ success: true, content });
    } catch (error) {
        console.error("reviewResume error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};

