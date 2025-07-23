import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';

function PersonalDetail({enabledNext}) {

    const params=useParams();
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext)

    const [formData,setFormData]=useState();
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        console.log("---",resumeInfo)
    },[])

    const handleInputChange=(e)=>{
        enabledNext(false)
        const {name,value}=e.target;

        setFormData({
            ...formData,
            [name]:value
        })
        setResumeInfo({
            ...resumeInfo,
            [name]:value
        })
    }

    const onSave=(e)=>{
        e.preventDefault();
        setLoading(true)
        const data=formData
        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(resp=>{
            console.log(resp);
            enabledNext(true);
            setLoading(false);
            toast.success("Details updated")
        },(error)=>{
            setLoading(false);
        })
        
    }
  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Personal Details</h2>
        <p>Get Started with the basic information</p>

        <form onSubmit={onSave}>
            <div className='grid grid-cols-2 mt-5 gap-3'>
                <div className='col-span-2'>
                    <label className='block mb-1 font-medium'>Full Name</label>
                    <Input name="fullName" defaultValue={resumeInfo?.fullName} required onChange={handleInputChange}  />
                </div>
                <div className='col-span-2'>
                    <label className='block mb-1 font-medium'>Job Title</label>
                    <Input name="jobTitle" required 
                    defaultValue={resumeInfo?.jobTitle}
                    onChange={handleInputChange}  />
                </div>
                <div className='col-span-2'>
                    <label className='block mb-1 font-medium'>Address</label>
                    <Input name="address" required 
                    defaultValue={resumeInfo?.address}
                    onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='block mb-1 font-medium'>Phone</label>
                    <Input name="phone" required 
                    defaultValue={resumeInfo?.phone}
                    onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='block mb-1 font-medium'>Email</label>
                    <Input name="email" required 
                    defaultValue={resumeInfo?.email}
                    onChange={handleInputChange}  />
                </div>
            </div>
            <div className='mt-3 flex justify-end'>
                <Button type="submit"
                disabled={loading}>
                    {loading?<LoaderCircle className='animate-spin' />:'Save'}
                    </Button>
            </div>
        </form>
    </div>
  )
}

export default PersonalDetail