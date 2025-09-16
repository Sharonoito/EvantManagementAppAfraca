import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import cloudinary from "./cloudinary";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function uploadImage(data:string, fileName: string) {
  // Convert Buffer to a base64 string
  const base64 = data//`data:image/png;base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "qr_codes",  // optional: organize in folder
    public_id: fileName.replace(/\s+/g, "_"), // optional: friendly file name
    overwrite: true,
  });

  return result.secure_url; // Cloudinary URL of the uploaded image
}

