import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// ✅ Fetch Colleges
export async function getColleges() {
  try {
    const { data, error } = await supabase.from("colleges").select("*");

    if (error) {
      console.error("❌ Error fetching colleges:", JSON.stringify(error, null, 2));
      return null;
    }
    return data;
  } catch (err: unknown) {
    console.error("🚨 Unexpected error fetching colleges:", err instanceof Error ? err.message : err);
    return null;
  }
}

// ✅ Add a College
export async function addCollege(college: any) {
  try {
    console.log("🔍 Raw College Data Before Insert:", college);

    if (!college?.name || !college?.location) {
      console.error("❌ Missing required fields:", { name: college?.name, location: college?.location });
      throw new Error("Missing required fields: 'name' and 'location' must be provided.");
    }

    const cleanCollege = {
      name: college.name.trim(),
      location: college.location.trim(),
      description: college.description?.trim() || null,
      ranking: college.ranking && !isNaN(Number(college.ranking)) ? Number(college.ranking) : null,
      admissionRate: college.admissionRate && !isNaN(parseFloat(college.admissionRate)) ? parseFloat(college.admissionRate) : null,
      tuition: college.tuition && !isNaN(Number(college.tuition)) ? Number(college.tuition) : null,
      website: college.website?.trim() || null,
      image: college.image || null, // ✅ Image upload handled
      brochure: college.brochure || null, // ✅ Brochure upload handled
    };

    console.log("✅ Cleaned College Data Before Insert:", JSON.stringify(cleanCollege, null, 2));

    const { data, error } = await supabase.from("colleges").insert([cleanCollege]).select();

    if (error) {
      console.error("❌ Error adding college:", JSON.stringify(error, null, 2));
      return null;
    }

    console.log("🎉 College added successfully:", data);
    return data;
  } catch (err: unknown) {
    console.error("🚨 Unexpected error adding college:", err instanceof Error ? err.message : err);
    return null;
  }
}

// ✅ Delete a College
export async function deleteCollege(collegeId: string) {
  try {
    const { error } = await supabase.from("colleges").delete().eq("id", collegeId);

    if (error) {
      console.error("❌ Error deleting college:", JSON.stringify(error, null, 2));
      return false;
    }

    console.log(`✅ College with ID ${collegeId} deleted successfully.`);
    return true;
  } catch (err: unknown) {
    console.error("🚨 Unexpected error deleting college:", err instanceof Error ? err.message : err);
    return false;
  }
}

// ✅ Check Supabase Storage Configuration
export async function checkSupabaseStorage() {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("❌ Error checking Supabase storage:", JSON.stringify(error, null, 2));
      return { success: false, message: error.message };
    }

    return { success: true, message: "✅ Storage is configured correctly." };
  } catch (err: unknown) {
    console.error("🚨 Unexpected storage error:", err instanceof Error ? err.message : err);
    return { success: false, message: "Unexpected storage error." };
  }
}

// ✅ Upload Brochure to Supabase Storage
export async function uploadBrochure(file: File) {
  try {
    if (!file) throw new Error("No brochure selected.");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `brochures/${fileName}`;

    console.log("📂 Uploading brochure:", filePath);

    const { data, error } = await supabase.storage.from("colleges").upload(filePath, file);

    if (error) {
      console.error("❌ Brochure Upload Failed:", JSON.stringify(error, null, 2));
      return null;
    }

    const publicUrl = supabase.storage.from("colleges").getPublicUrl(filePath).data.publicUrl;
    
    if (!publicUrl) {
      throw new Error("Error retrieving public URL for brochure.");
    }

    console.log("✅ Brochure Uploaded Successfully:", publicUrl);
    return publicUrl;
  } catch (err: unknown) {
    console.error("🚨 Brochure Upload Failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// ✅ Update College Details
export async function updateCollege(id: string, updatedFields: any) {
  try {
    console.log("🔍 Updating College ID:", id, "with data:", JSON.stringify(updatedFields, null, 2));

    if (!id || Object.keys(updatedFields).length === 0) {
      console.error("❌ Error: College ID and updated fields are required.");
      return null;
    }

    const { data, error } = await supabase.from("colleges").update(updatedFields).eq("id", id).select();

    if (error) {
      console.error("❌ Error updating college:", JSON.stringify(error, null, 2));
      return null;
    }

    console.log("✅ College updated successfully:", data);
    return data;
  } catch (err: unknown) {
    console.error("🚨 Unexpected error updating college:", err instanceof Error ? err.message : err);
    return null;
  }
}
