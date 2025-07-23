import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from '../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function SocialMedia() {

    const [socialList,setSocialList]=useState([{
        name:'',
        link:'',
    }])
    const {resumeId}=useParams();

    const [loading,setLoading]=useState(false);
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
   
    useEffect(()=>{
        resumeInfo&&setSocialList(resumeInfo?.social)
      },[])
   
    const handleChange=(index,name,value)=>{
        const newEntries=socialList.slice();
      
        newEntries[index][name]=value;
        setSocialList(newEntries);
    }

    const AddNewSkills=()=>{
        setSocialList([...socialList,{
            name:'',
            link:'' 
        }])
    }
    const RemoveSkills=()=>{
        setSocialList(socialList=>socialList.slice(0,-1))
    }

    const onSave=()=>{

        setLoading(true);
        const data={
            social:socialList.map(({ id, ...rest }) => rest)
        }

        GlobalApi.UpdateResumeDetail(resumeId,data)
        .then(resp=>{
            console.log(resp);
            setLoading(false);
            toast('Details updated !')
        },(error)=>{
            setLoading(false);
            toast('Server Error, Try again!')
        })
    }

    useEffect(()=>{
        setResumeInfo({
            ...resumeInfo,
            social:socialList
        })
    },[socialList])
  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
    <h2 className='font-bold text-lg'>Social Media</h2>
    <p>Add Your top professional social media</p>

    <div>
        {socialList.map((item,index)=>(
            <div className='grid grid-cols-2 mt-5 gap-3 mb-2' key={index}>
                <div>
                    <label className='text-xs'>Social Media</label>
                    <Input 
                    className="w-full"
                    defaultValue={item.socialMediaName}
                    placeholder="LinkedIn"
                    onChange={(e)=>handleChange(index,'socialMediaName',e.target.value)} />
                </div>
                <div>
                    <label className='text-xs'>Link</label>
                    <Input 
                    className="w-full"
                    defaultValue={item.socialMediaLink} required
                    placeholder="https://linkedin.com/in/..."
                    onChange={(e)=>handleChange(index,'socialMediaLink',e.target.value)} />
                </div>
            </div>
        ))}
    </div>
    <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewSkills} className="text-primary"> + Add</Button>
            <Button variant="outline" onClick={RemoveSkills} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
    </div>
  )
}

export default SocialMedia