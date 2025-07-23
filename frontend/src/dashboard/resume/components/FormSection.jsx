import React, { useState } from 'react'
import PersonalDetail from './resumeForm/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import Summery from './resumeForm/Summery';
import Experience from './resumeForm/Experience';
import Education from './resumeForm/Education';
import Skills from './resumeForm/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import Theme from './Theme';
import SocialMedia from './resumeForm/SocialMedia';
import Project from './resumeForm/Project';
import Achievement from './resumeForm/Achievement';
import Interest from './resumeForm/Interest';
import CertificationOrExtraCurricular from './resumeForm/CertificationOrExtraCurricular';

function FormSection() {
  const [activeFormIndex,setActiveFormIndex]=useState(1);
  const [enableNext,setEnableNext]=useState(true);
  const {resumeId}=useParams();
  return (
    <div>
        <div className='flex justify-between items-center'>
          <div className='flex gap-5'>
            <Link to={"/dashboard"}>
          <Button><Home/></Button>
          </Link>
          <Theme/>
         
          </div>
          <div className='flex gap-2'>
            {activeFormIndex>1
            &&<Button size="sm" 
            onClick={()=>setActiveFormIndex(activeFormIndex-1)}> <ArrowLeft/> </Button> }
            <Button 
            disabled={!enableNext}
            className="flex gap-2" size="sm"
            onClick={()=>setActiveFormIndex(activeFormIndex+1)}
            > Next 
            <ArrowRight/> </Button>
          </div>
        </div>
        {/* Personal Detail  */}
        {activeFormIndex==1?  
        <PersonalDetail enabledNext={(v)=>setEnableNext(v)} />
        :activeFormIndex==2?
              <Summery  enabledNext={(v)=>setEnableNext(v)} />
        :activeFormIndex==3?
          <Experience />  
          :activeFormIndex==4?
          <Education/>
          :activeFormIndex==5?
          <Project/>
          :activeFormIndex==6?
          <Achievement/>
          :activeFormIndex==7?
          <Skills/>
          :activeFormIndex==8?
          <Interest/>
          :activeFormIndex==9?
          <CertificationOrExtraCurricular/>
          :activeFormIndex==10?
          <SocialMedia/>
          :activeFormIndex==11?
          <Navigate to={'/my-resume/'+resumeId+"/view"}/>
              
        :null
          }
        

    </div>
  )
}

export default FormSection