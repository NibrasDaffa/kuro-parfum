import { z } from "zod";

const category = z.enum(["edp", "edt", "extrait"], {
  errorMap: () => ({ message: "Kategori tidak valid." }),
});

const aroma = z.enum(["floral", "woody", "oriental", "fresh", "fougere"], {
  errorMap: () => ({ message: "Kelompok aroma tidak valid." }),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(255),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter.")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung."),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  price: z.number().positive("Harga harus lebih dari 0.").max(9999999999),
  category,
  aroma_group: aroma,
  top_notes: z.string().trim().min(1, "Top notes wajib diisi.").max(500),
  middle_notes: z.string().trim().min(1, "Middle notes wajib diisi.").max(500),
  base_notes: z.string().trim().min(1, "Base notes wajib diisi.").max(500),
  volume_ml: z.number().int().positive("Volume harus lebih dari 0.").max(1000),
  stock: z.number().int().min(0, "Stok tidak boleh negatif."),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  images: z.array(z.string().url("URL gambar tidak valid.")).min(1, "Minimal satu gambar.").max(8),
});

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(255),
  customer_phone: z
    .string()
    .trim()
    .min(10, "Nomor HP minimal 10 karakter.")
    .max(20)
    .refine((value) => (value.match(/\d/g) ?? []).length >= 10, "Nomor HP minimal 10 digit."),
  customer_address: z.string().trim().min(10, "Alamat minimal 10 karakter.").max(1000),
  notes: z.string().trim().max(1000, "Catatan maksimal 1000 karakter.").optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1, "Jumlah minimal 1.").max(10, "Jumlah maksimal 10 per produk."),
      }),
    )
    .min(1, "Keranjang masih kosong.")
    .max(30),
});

export const orderStatusSchema = z.object({
  status: z.enum(["new", "processing", "done"], {
    errorMap: () => ({ message: "Status pesanan tidak valid." }),
  }),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
