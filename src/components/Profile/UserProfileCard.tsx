
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Camera } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';

interface UserProfileCardProps {
  user: {
    _id: string;
    name: string;
    role: string;
    email: string;
    mobile: string;
    employeeId: string;
    department: string;
  }
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const [name, setName] = useState(user.name);
  const [mobile, setMobile] = useState(user.mobile);
  // const [dob, setDob] = useState<Date | undefined>(user.dob);
  const [isEditing, setIsEditing] = useState(false);
  // const [avatarFile, setAvatarFile] = useState<File | null>(null);
  // const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatar);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setAvatarFile(file);

  //     // Create a preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       // setAvatarPreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSave = async() => {

    let submitData = { ...user , name: name , mobile:mobile}

    let res = await axios.put(`https://exam-backend-mocha.vercel.app/register/${user._id}` , submitData)

    if(res.data.success === true){
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>View and update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {/* <AvatarImage src={avatarPreview} /> */}
                <AvatarFallback className="bg-university-primary text-white text-2xl">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* {isEditing && (
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-university-primary flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )} */}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name = "name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <Input id="name" value={name} readOnly className="bg-muted" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" value={user.employeeId} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="mobile"
                    name = "mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                ) : (
                  <Input id="mobile" value={mobile} readOnly className="bg-muted" />
                )}
              </div>
            </div>

            { user.role === "faculty" &&

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school">School/Department</Label>
                <Input id="school" value={user.department} readOnly className="bg-muted" />
              </div>
            </div>
            }

            <div className="flex justify-end pt-4 space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
