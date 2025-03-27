"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { getColleges, addCollege, deleteCollege } from "@/lib/supabase-college-api"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Upload,
  Image,
  FileText,
  Download,
} from "lucide-react"

type College = {
  id: string
  name: string
  location: string
  description?: string
  ranking?: string
  admissionRate?: string
  tuition?: string
  website?: string
  image?: string
  brochure?: string
  created_at?: string
}

export function AdminPanel() {
  const [colleges, setColleges] = useState<College[]>([])
  const [filteredColleges, setFilteredColleges] = useState<College[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCollege, setNewCollege] = useState({
    name: "",
    location: "",
    description: "",
    ranking: "",
    admissionRate: "",
    tuition: "",
    website: "",
    image: "",
    brochure: "",
  })
  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null)
  const [collegeToEdit, setCollegeToEdit] = useState<College | null>(null)
  const [brochureFile, setBrochureFile] = useState<File | null>(null)
  const [brochureUrl, setBrochureUrl] = useState<string>("")
  const brochureInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
    visible: boolean
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Authentication Check
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/dashboard/login")
        return
      }

      setUser(session.user)
      setIsLoading(false)
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/dashboard/login")
      } else {
        setUser(session.user)
        setIsLoading(false)
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [router])

  // Fetch Colleges
  const fetchColleges = async () => {
    if (!user) return

    try {
      setIsRefreshing(true)
      const collegesData = await getColleges()
      if (collegesData) {
        setColleges(collegesData)
        setFilteredColleges(collegesData)
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "There was a problem loading the colleges. Please try again.",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchColleges()
    }
  }, [user])

  // Filter colleges based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredColleges(colleges)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = colleges.filter(
        (college) => college.name.toLowerCase().includes(query) || college.location.toLowerCase().includes(query),
      )
      setFilteredColleges(filtered)
    }
  }, [searchQuery, colleges])

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/dashboard/login")
  }

  // Handle Image Upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `college-images/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage.from("colleges").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("colleges").getPublicUrl(filePath)

      // Update the college image URL
      if (collegeToEdit) {
        setCollegeToEdit({ ...collegeToEdit, image: publicUrl })
      } else {
        setNewCollege({ ...newCollege, image: publicUrl })
      }

      setNotification({
        type: "success",
        message: "Image uploaded successfully!",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error: any) {
      setNotification({
        type: "error",
        message: `Upload failed: ${error.message}`,
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsUploading(false)
    }
  }

  // Handle Brochure Upload
  const handleBrochureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `college-brochures/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage.from("colleges").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("colleges").getPublicUrl(filePath)

      // Update the brochure URL
      if (collegeToEdit) {
        setCollegeToEdit({ ...collegeToEdit, brochure: publicUrl })
      } else {
        setNewCollege({ ...newCollege, brochure: publicUrl })
      }
      setBrochureUrl(publicUrl)
      setBrochureFile(file)

      setNotification({
        type: "success",
        message: "Brochure uploaded successfully!",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error: any) {
      setNotification({
        type: "error",
        message: `Upload failed: ${error.message}`,
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsUploading(false)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Add a function to trigger brochure file input
  const triggerBrochureInput = () => {
    brochureInputRef.current?.click()
  }

  // Handle Add College
  const handleAddCollege = async () => {
    if (!newCollege.name || !newCollege.location) {
      setNotification({
        type: "error",
        message: "Please provide both name and location for the college.",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      setIsSubmitting(true)
      await addCollege({
        name: newCollege.name,
        location: newCollege.location,
        description: newCollege.description,
        ranking: newCollege.ranking,
        admissionRate: newCollege.admissionRate,
        tuition: newCollege.tuition,
        website: newCollege.website,
        image: newCollege.image,
        brochure: newCollege.brochure,
      })

      setNewCollege({
        name: "",
        location: "",
        description: "",
        ranking: "",
        admissionRate: "",
        tuition: "",
        website: "",
        image: "",
        brochure: "",
      })

      setNotification({
        type: "success",
        message: `${newCollege.name} has been successfully added.`,
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
      fetchColleges()
    } catch (error) {
      setNotification({
        type: "error",
        message: "There was a problem adding the college. Please try again.",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete College
  const handleDeleteCollege = async (id: string) => {
    try {
      await deleteCollege(id)
      setNotification({
        type: "success",
        message: "The college has been successfully removed.",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
      fetchColleges()
    } catch (error) {
      setNotification({
        type: "error",
        message: "There was a problem deleting the college. Please try again.",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Add a function to handle editing a college
  const handleEditCollege = async () => {
    if (!collegeToEdit) return

    try {
      setIsSubmitting(true)

      const { error } = await supabase
        .from("colleges")
        .update({
          name: collegeToEdit.name,
          location: collegeToEdit.location,
          description: collegeToEdit.description,
          ranking: collegeToEdit.ranking,
          admissionRate: collegeToEdit.admissionRate,
          tuition: collegeToEdit.tuition,
          website: collegeToEdit.website,
          image: collegeToEdit.image,
          brochure: collegeToEdit.brochure,
        })
        .eq("id", collegeToEdit.id)

      if (error) throw error

      setNotification({
        type: "success",
        message: `${collegeToEdit.name} has been successfully updated.`,
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
      fetchColleges()
      setCollegeToEdit(null)
    } catch (error) {
      setNotification({
        type: "error",
        message: "There was a problem updating the college. Please try again.",
        visible: true,
      })

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loader while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading admin panel...</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-lg transition-all ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 rounded-full p-1 hover:bg-black/5">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CardTitle className="text-2xl">Yesp Web Studio</CardTitle>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <span className="text-sm text-muted-foreground">Logged in as: {user?.email}</span>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Log Out
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Add Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={fetchColleges} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add College
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New College</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">College Name*</Label>
                        <Input
                          id="name"
                          value={newCollege.name}
                          onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                          placeholder="Enter college name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location*</Label>
                        <Input
                          id="location"
                          value={newCollege.location}
                          onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
                          placeholder="City, State"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newCollege.description}
                        onChange={(e) => setNewCollege({ ...newCollege, description: e.target.value })}
                        placeholder="Brief description of the college"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ranking">Ranking</Label>
                        <Input
                          id="ranking"
                          value={newCollege.ranking}
                          onChange={(e) => setNewCollege({ ...newCollege, ranking: e.target.value })}
                          placeholder="e.g. Ranked #2 in National Universities"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="admissionRate">Admission Rate</Label>
                        <Input
                          id="admissionRate"
                          value={newCollege.admissionRate}
                          onChange={(e) => setNewCollege({ ...newCollege, admissionRate: e.target.value })}
                          placeholder="e.g. 4.6%"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="tuition">Tuition</Label>
                        <Input
                          id="tuition"
                          value={newCollege.tuition}
                          onChange={(e) => setNewCollege({ ...newCollege, tuition: e.target.value })}
                          placeholder="e.g. $51,925"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={newCollege.website}
                          onChange={(e) => setNewCollege({ ...newCollege, website: e.target.value })}
                          placeholder="e.g. https://www.harvard.edu"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="image">College Image</Label>
                      <div className="flex flex-col gap-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />

                        <div
                          onClick={triggerFileInput}
                          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                            isUploading ? "bg-muted/50 border-muted" : "hover:bg-muted/50 hover:border-primary/50"
                          }`}
                        >
                          {newCollege.image ? (
                            <div className="w-full flex flex-col items-center gap-3">
                              <div className="relative w-40 h-40 rounded-md overflow-hidden border">
                                <img
                                  src={newCollege.image || "/placeholder.svg"}
                                  alt="College preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setNewCollege({ ...newCollege, image: "" })
                                  }}
                                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <span className="text-sm text-muted-foreground">Click to change image</span>
                            </div>
                          ) : (
                            <>
                              {isUploading ? (
                                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                              ) : (
                                <Upload className="h-10 w-10 text-muted-foreground" />
                              )}
                              <p className="text-sm font-medium">
                                {isUploading ? "Uploading..." : "Click to upload an image"}
                              </p>
                              <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </>
                          )}
                        </div>

                        {!newCollege.image && (
                          <div className="flex items-center">
                            <div className="h-px flex-1 bg-muted"></div>
                            <span className="px-2 text-xs text-muted-foreground">or</span>
                            <div className="h-px flex-1 bg-muted"></div>
                          </div>
                        )}

                        {!newCollege.image && (
                          <div className="flex gap-2">
                            <Input
                              id="imageUrl"
                              value={newCollege.image}
                              onChange={(e) => setNewCollege({ ...newCollege, image: e.target.value })}
                              placeholder="Enter image URL directly"
                              className="flex-1"
                            />
                            {newCollege.image && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setNewCollege({ ...newCollege, image: "" })}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add brochure upload section */}
                    <div className="grid gap-2">
                      <Label htmlFor="brochure">College Brochure</Label>
                      <div className="flex flex-col gap-3">
                        <input
                          type="file"
                          ref={brochureInputRef}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleBrochureUpload}
                        />

                        <div
                          onClick={triggerBrochureInput}
                          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                            isUploading ? "bg-muted/50 border-muted" : "hover:bg-muted/50 hover:border-primary/50"
                          }`}
                        >
                          {newCollege.brochure ? (
                            <div className="w-full flex flex-col items-center gap-3">
                              <div className="flex items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-primary"
                                >
                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span className="font-medium">Brochure uploaded</span>
                              </div>
                              <a
                                href={newCollege.brochure}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View brochure
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNewCollege({ ...newCollege, brochure: "" })
                                }}
                                className="text-sm text-red-500 hover:underline"
                              >
                                Remove brochure
                              </button>
                            </div>
                          ) : (
                            <>
                              {isUploading ? (
                                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="40"
                                  height="40"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground"
                                >
                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              )}
                              <p className="text-sm font-medium">
                                {isUploading ? "Uploading..." : "Click to upload a brochure"}
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (max. 10MB)</p>
                            </>
                          )}
                        </div>

                        {!newCollege.brochure && (
                          <div className="flex items-center">
                            <div className="h-px flex-1 bg-muted"></div>
                            <span className="px-2 text-xs text-muted-foreground">or</span>
                            <div className="h-px flex-1 bg-muted"></div>
                          </div>
                        )}

                        {!newCollege.brochure && (
                          <div className="flex gap-2">
                            <Input
                              id="brochureUrl"
                              value={newCollege.brochure}
                              onChange={(e) => setNewCollege({ ...newCollege, brochure: e.target.value })}
                              placeholder="Enter brochure URL directly"
                              className="flex-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddCollege} disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add College
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Colleges Table */}
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border-b p-2 text-left">College</th>
                    <th className="border-b p-2 text-left">Location</th>
                    <th className="border-b p-2 text-left">Admission</th>
                    <th className="border-b p-2 text-left">Tuition</th>
                    <th className="border-b p-2 text-left">Brochure</th>
                    <th className="border-b p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredColleges.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border-b p-4 text-center text-muted-foreground">
                        {searchQuery ? "No colleges match your search." : "No colleges added yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredColleges.map((college) => (
                      <tr key={college.id} className="hover:bg-muted/50">
                        <td className="border-b p-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                              {college.image ? (
                                <img
                                  src={college.image || "/placeholder.svg"}
                                  alt={college.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Image className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{college.name}</div>
                              {college.website && (
                                <a
                                  href={college.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:underline"
                                >
                                  {college.website.replace(/^https?:\/\//, "")}
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="border-b p-2">{college.location}</td>
                        <td className="border-b p-2">
                          {college.admissionRate && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                              {college.admissionRate}
                            </span>
                          )}
                        </td>
                        <td className="border-b p-2">{college.tuition}</td>
                        <td className="border-b p-2">
                          {college.brochure ? (
                            <a
                              href={college.brochure}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                            >
                              <FileText className="h-4 w-4" />
                              <span className="text-xs">View</span>
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </td>
                        <td className="border-b p-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{college.name}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  {college.image ? (
                                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                                      <img
                                        src={college.image || "/placeholder.svg"}
                                        alt={college.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                                      <Image className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                                      <p>{college.location}</p>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium text-muted-foreground">Admission Rate</h3>
                                      <p>{college.admissionRate || "Not specified"}</p>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium text-muted-foreground">Tuition</h3>
                                      <p>{college.tuition || "Not specified"}</p>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium text-muted-foreground">Ranking</h3>
                                      <p>{college.ranking || "Not specified"}</p>
                                    </div>
                                    {college.website && (
                                      <div className="col-span-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                                        <a
                                          href={college.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 hover:underline"
                                        >
                                          {college.website}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                  {college.description && (
                                    <div>
                                      <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                      <p className="mt-1">{college.description}</p>
                                    </div>
                                  )}
                                  {/* Enhanced brochure display in details view */}
                                  {college.brochure && (
                                    <div className="border rounded-md p-4 bg-blue-50">
                                      <h3 className="text-sm font-medium text-blue-800 mb-2">College Brochure</h3>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-8 w-8 text-blue-600" />
                                          <div>
                                            <p className="text-sm font-medium">College Information PDF</p>
                                            <p className="text-xs text-muted-foreground">
                                              Download the official college brochure
                                            </p>
                                          </div>
                                        </div>
                                        <a
                                          href={college.brochure}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                          <Download className="h-4 w-4" />
                                          Download PDF
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Add Edit button */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setCollegeToEdit({ ...college })}>
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit College</DialogTitle>
                                </DialogHeader>
                                {collegeToEdit && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-name">College Name*</Label>
                                        <Input
                                          id="edit-name"
                                          value={collegeToEdit.name}
                                          onChange={(e) => setCollegeToEdit({ ...collegeToEdit, name: e.target.value })}
                                          placeholder="Enter college name"
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-location">Location*</Label>
                                        <Input
                                          id="edit-location"
                                          value={collegeToEdit.location}
                                          onChange={(e) =>
                                            setCollegeToEdit({ ...collegeToEdit, location: e.target.value })
                                          }
                                          placeholder="City, State"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-description">Description</Label>
                                      <textarea
                                        id="edit-description"
                                        className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={collegeToEdit.description || ""}
                                        onChange={(e) =>
                                          setCollegeToEdit({ ...collegeToEdit, description: e.target.value })
                                        }
                                        placeholder="Brief description of the college"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-ranking">Ranking</Label>
                                        <Input
                                          id="edit-ranking"
                                          value={collegeToEdit.ranking || ""}
                                          onChange={(e) =>
                                            setCollegeToEdit({ ...collegeToEdit, ranking: e.target.value })
                                          }
                                          placeholder="e.g. Ranked #2 in National Universities"
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-admissionRate">Admission Rate</Label>
                                        <Input
                                          id="edit-admissionRate"
                                          value={collegeToEdit.admissionRate || ""}
                                          onChange={(e) =>
                                            setCollegeToEdit({ ...collegeToEdit, admissionRate: e.target.value })
                                          }
                                          placeholder="e.g. 4.6%"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-tuition">Tuition</Label>
                                        <Input
                                          id="edit-tuition"
                                          value={collegeToEdit.tuition || ""}
                                          onChange={(e) =>
                                            setCollegeToEdit({ ...collegeToEdit, tuition: e.target.value })
                                          }
                                          placeholder="e.g. $51,925"
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-website">Website</Label>
                                        <Input
                                          id="edit-website"
                                          value={collegeToEdit.website || ""}
                                          onChange={(e) =>
                                            setCollegeToEdit({ ...collegeToEdit, website: e.target.value })
                                          }
                                          placeholder="e.g. https://www.harvard.edu"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-image">College Image</Label>
                                      <div className="flex flex-col gap-3">
                                        <input
                                          type="file"
                                          ref={fileInputRef}
                                          className="hidden"
                                          accept="image/*"
                                          onChange={handleImageUpload}
                                        />

                                        <div
                                          onClick={triggerFileInput}
                                          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                                            isUploading
                                              ? "bg-muted/50 border-muted"
                                              : "hover:bg-muted/50 hover:border-primary/50"
                                          }`}
                                        >
                                          {collegeToEdit.image ? (
                                            <div className="w-full flex flex-col items-center gap-3">
                                              <div className="relative w-40 h-40 rounded-md overflow-hidden border">
                                                <img
                                                  src={collegeToEdit.image || "/placeholder.svg"}
                                                  alt="College preview"
                                                  className="w-full h-full object-cover"
                                                />
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    setCollegeToEdit({ ...collegeToEdit, image: "" })
                                                  }}
                                                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90"
                                                >
                                                  <X className="h-4 w-4" />
                                                </button>
                                              </div>
                                              <span className="text-sm text-muted-foreground">
                                                Click to change image
                                              </span>
                                            </div>
                                          ) : (
                                            <>
                                              {isUploading ? (
                                                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                                              ) : (
                                                <Upload className="h-10 w-10 text-muted-foreground" />
                                              )}
                                              <p className="text-sm font-medium">
                                                {isUploading ? "Uploading..." : "Click to upload an image"}
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                SVG, PNG, JPG or GIF (max. 5MB)
                                              </p>
                                            </>
                                          )}
                                        </div>

                                        {!collegeToEdit.image && (
                                          <div className="flex items-center">
                                            <div className="h-px flex-1 bg-muted"></div>
                                            <span className="px-2 text-xs text-muted-foreground">or</span>
                                            <div className="h-px flex-1 bg-muted"></div>
                                          </div>
                                        )}

                                        {!collegeToEdit.image && (
                                          <div className="flex gap-2">
                                            <Input
                                              id="edit-imageUrl"
                                              value={collegeToEdit.image || ""}
                                              onChange={(e) =>
                                                setCollegeToEdit({ ...collegeToEdit, image: e.target.value })
                                              }
                                              placeholder="Enter image URL directly"
                                              className="flex-1"
                                            />
                                            {collegeToEdit.image && (
                                              <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setCollegeToEdit({ ...collegeToEdit, image: "" })}
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Add brochure upload section */}
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-brochure">College Brochure</Label>
                                      <div className="flex flex-col gap-3">
                                        <input
                                          type="file"
                                          ref={brochureInputRef}
                                          className="hidden"
                                          accept=".pdf,.doc,.docx"
                                          onChange={handleBrochureUpload}
                                        />

                                        <div
                                          onClick={triggerBrochureInput}
                                          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                                            isUploading
                                              ? "bg-muted/50 border-muted"
                                              : "hover:bg-muted/50 hover:border-primary/50"
                                          }`}
                                        >
                                          {collegeToEdit.brochure ? (
                                            <div className="w-full flex flex-col items-center gap-3">
                                              <div className="flex items-center gap-2">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="text-primary"
                                                >
                                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                  <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                                <span className="font-medium">Brochure uploaded</span>
                                              </div>
                                              <a
                                                href={collegeToEdit.brochure}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                View brochure
                                              </a>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setCollegeToEdit({ ...collegeToEdit, brochure: "" })
                                                }}
                                                className="text-sm text-red-500 hover:underline"
                                              >
                                                Remove brochure
                                              </button>
                                            </div>
                                          ) : (
                                            <>
                                              {isUploading ? (
                                                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                                              ) : (
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="40"
                                                  height="40"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="text-muted-foreground"
                                                >
                                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                  <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                              )}
                                              <p className="text-sm font-medium">
                                                {isUploading ? "Uploading..." : "Click to upload a brochure"}
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                PDF, DOC, or DOCX (max. 10MB)
                                              </p>
                                            </>
                                          )}
                                        </div>

                                        {!collegeToEdit.brochure && (
                                          <div className="flex items-center">
                                            <div className="h-px flex-1 bg-muted"></div>
                                            <span className="px-2 text-xs text-muted-foreground">or</span>
                                            <div className="h-px flex-1 bg-muted"></div>
                                          </div>
                                        )}

                                        {!collegeToEdit.brochure && (
                                          <div className="flex gap-2">
                                            <Input
                                              id="edit-brochureUrl"
                                              value={collegeToEdit.brochure || ""}
                                              onChange={(e) =>
                                                setCollegeToEdit({ ...collegeToEdit, brochure: e.target.value })
                                              }
                                              placeholder="Enter brochure URL directly"
                                              className="flex-1"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button onClick={handleEditCollege} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => setCollegeToDelete(college)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete {college.name}. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleDeleteCollege(college.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredColleges.length} of {colleges.length} colleges
          </div>
        </CardContent>
        <CardTitle className="text-2xl font-bold text-center ">
          <Label htmlFor="text">Powered by Yesp Web Studio</Label>
        </CardTitle>
      </Card>
    </div>
  )
}

