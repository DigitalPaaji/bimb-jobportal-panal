"use client"
import { base_url, img_url } from '@/components/store/config';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaQuestionCircle } from 'react-icons/fa';
import { FaArrowLeft, FaBriefcase, FaBuilding, FaCalendarDays, FaCheck, FaChevronDown, FaCircleInfo, FaEnvelope, FaFloppyDisk, FaGlobe, FaGraduationCap, FaLocationDot, FaMoneyBill1Wave, FaMoneyBillWave, FaPhone, FaPlus, FaRocket, FaUserGroup, FaXmark } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';
axios.defaults.withCredentials= true


const page = () => {
    const {id} = useParams()
const [allCategory,setAllCategory]=useState([ ])
const [allSubCategory,setAllSubCategory]=useState([])
    const [categoryLoading, setCategoryLoading] =useState(false);
   const [loading, setLoading] = useState(false);
   const [skill,setSkill]=useState("")
   const [educ,setEduc]=useState("")
   const [responsibilitie,setResponsibilities]=useState("")
   const [requirement,setRequirement]=useState("")
   const [benefit,setBenefit]=useState("")
   const [question,setQuestion]=useState("")


const [jobData,setJobData]=useState({  title:"",description:"",jobType:"",workMode:"ONSITE",companyName:"",companyWebsite:"",
       image:null,category:"",subcategory:"", location: {city: "",state:"",country:"",address: "",},
       experience:{min:"",max:""},salary:{min:"",max:"",currency:"INR",period:"YEARLY"},skills:[],
       education:[],responsibilities:[],requirements:[],benefits:[],questions:[],
       applicationUrl:"",applicationDeadline:"",contactEmail:"",contactPhone:"",vacancies:"",status:"PUBLISHED",
      isFeatured:false,isUrgent:false,companyLogo:""
   
    })
const router = useRouter()

 const fetchAllCate = async () => {
    try {
      const response = await axios.get(`${base_url}/category/get`);

      const data = response.data;

      if (data.success) {
        setAllCategory(data.allCategory || []);
      } else {
        setAllCategory([]);
        toast.error(data.message);
      }
    } catch (error: any) {
      setAllCategory([]);

      toast.error(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

const fetchAllSubCate = async () => {
    try {
      const response = await axios.get(`${base_url}/category/sub/get`);

      const data = response.data;

      if (data.success) {
        setAllSubCategory(data.subCategory || []);
      } else {
        setAllSubCategory([]);
        toast.error(data.message);
      }
    } catch (error: any) {
      setAllSubCategory([]);

      toast.error(
        error?.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  };
 const fetchJob = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/job/get/${id}`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        setJobData(response.data.job);
      } else {
        toast.error(response.data?.message || "Failed to fetch job");
      }
    } catch (error: any) {
      console.error("Fetch job error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch job details"
      );
    } finally {
      setLoading(false);
    }
  };



   

  useEffect(() => {
    fetchAllCate();
    fetchAllSubCate();
    fetchJob()
  }, []);


  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#153497] focus:ring-4 focus:ring-[#153497]/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

const handleInput = (e: any)=>{
  const {name,value}= e.target
setJobData(prev=>({...prev,[name]:value}))}


const handleInputLocation = (e: any)=>{
  const {name,value}= e.target
setJobData(prev=>({...prev,location:{...prev.location,[name]:value}}))}


 const handleLogo = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

     setJobData((prev : any) => ({
    ...prev,
    image: file,
  }));

   
  };

 const filteredSubCategory =
    allSubCategory.filter((item: any) => {
      const categoryId =
        typeof item.category === "string"
          ? item.category
          : item.category?._id;

      return categoryId === jobData.category;
    });

const HandelSkill= ()=>{
if(!skill.trim()){
toast.warn("Enter Skill")
return 
}

setJobData((prev: any)=>({...prev,skills:[...prev.skills,skill]}))
setSkill("")

}
const removeSkill= (skillindex :number)=>{
const skills = jobData.skills.filter((_,indx)=>indx !=skillindex)

setJobData((prev)=>({...prev,skills}))

}
const HandelEdu= ()=>{
if(!educ.trim()){
toast.warn("Enter Education")
return 
}

setJobData((prev: any)=>({...prev,education:[...prev.education,educ]}))
setEduc("")

}


const removeEduc= (skillindex :number)=>{
const education = jobData.education.filter((_,indx)=>indx !=skillindex)

setJobData((prev)=>({...prev,education}))

}



const HandelRes= ()=>{
if(!responsibilitie.trim()){
toast.warn("Enter Responsibilities")
return 
}

setJobData((prev: any)=>({...prev,responsibilities:[...prev.responsibilities,responsibilitie]}))
setResponsibilities("")

}


const removeRes= (skillindex :number)=>{
const responsibilities = jobData.responsibilities.filter((_,indx)=>indx !=skillindex)

setJobData((prev)=>({...prev,responsibilities}))

}


const HandelReq= ()=>{
if(!requirement.trim()){
toast.warn("Enter requirement")
return 
}

setJobData((prev: any)=>({...prev,requirements:[...prev.requirements,requirement]}))
setRequirement("")

}


const removeReq= (skillindex :number)=>{
const requirements = jobData.requirements.filter((_,indx)=>indx !=skillindex)

setJobData((prev)=>({...prev,requirements}))

}

const HandelBenif= ()=>{
if(!benefit.trim()){
toast.warn("Enter benefit")
return 
}

setJobData((prev: any)=>({...prev,benefits:[...prev.benefits,benefit]}))
setBenefit("")

}


const removeBenif= (skillindex :number)=>{
const benefits = jobData.benefits.filter((_,indx)=>indx !=skillindex)

setJobData((prev)=>({...prev,benefits}))

}
const HandelQuestion= ()=>{
if(!question.trim()){
toast.warn("Enter question")
return 
}

setJobData((prev: any)=>({...prev,questions:[...prev.questions,question]}))
setQuestion("")

}


const removeQuestion= (skillindex :number)=>{
const questions = jobData.questions.filter((_,indx)=>indx !=skillindex)

setJobData((prev)=>({...prev,questions}))

}

const handleCheckbox =(e: ChangeEvent<HTMLInputElement>)=>{
  // e.preventDefault()
 const { name, checked } = e.target;
  setJobData((prev) => ({
      ...prev,
      [name]: checked,
    }));
}


const handleSubmit = async(e: FormEvent<HTMLFormElement>)=>{ 
      e.preventDefault();
      try {
        setLoading(true);

const formData = new FormData()

formData.append("title",jobData.title)
formData.append("description",jobData.description)
formData.append("jobType",jobData.jobType)
formData.append("workMode",jobData.workMode)
formData.append("companyName",jobData.companyName)
formData.append("companyWebsite",jobData.companyWebsite)
formData.append("category",jobData.category)
formData.append("subcategory",jobData.subcategory)
formData.append("applicationUrl",jobData.applicationUrl)
formData.append("applicationDeadline",jobData.applicationDeadline)
formData.append("contactEmail",jobData.contactEmail)
formData.append("contactPhone",jobData.contactPhone)
formData.append("vacancies",jobData.vacancies)
formData.append("status",jobData.status)
formData.append("isFeatured",jobData.isFeatured?"true":"false")
formData.append("isUrgent",jobData.isUrgent?"true":"false" )
formData.append("companyLogo",jobData.companyLogo)



formData.append("location",JSON.stringify(jobData.location))
formData.append("experience",JSON.stringify(jobData.experience))
formData.append("salary",JSON.stringify(jobData.salary))
formData.append("skills",JSON.stringify(jobData.skills))
formData.append("education",JSON.stringify(jobData.education))
formData.append("responsibilities",JSON.stringify(jobData.responsibilities))
formData.append("requirements",JSON.stringify(jobData.requirements))
formData.append("benefits",JSON.stringify(jobData.benefits))
formData.append("questions",JSON.stringify(jobData.questions))



if(jobData.image){
formData.append("image",jobData.image)

}

      
        const response = await axios.put(`${base_url}/job/update/${id}`,formData,{withCredentials:true})
        const data = await response.data;
      if(data.success){
        toast.success(data.message)
        router.push("/jobs")
      }else{
        toast.error(data.message)

      }
      } catch (error : any) {
        toast.error(error?.response?.data?.message)
             setLoading(false);
      }finally{
         setLoading(false);
      }
}


  return (
     <div className="h-screen overflow-auto bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl">

 <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
            >
              <FaArrowLeft size={14} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Edit Job
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new job posting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <FaCircleInfo size={14} />
            Required fields are marked *
          </div>
        </div>
 <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


   <Section
            icon={<FaBriefcase />}
            title="Job Information"
            description="Basic information about the position"
          >
            <div className="space-y-5">

              <div>
                <label className={labelClass}>
                  Job Title
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="title"
                  value={jobData.title}
                  onChange={handleInput}
                  placeholder="e.g. Senior Full Stack Developer"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Job Description
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleInput}
                  rows={7}
                  placeholder="Write a detailed description of the job..."
                  className={`${inputClass} resize-none`}
                  required
                />

                <div className="mt-1 text-right text-xs text-slate-400">
                  {jobData.description.length} characters
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className={labelClass}>
                    Job Type
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      name="jobType"
                      value={jobData.jobType}
                      onChange={handleInput}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="FULL_TIME">
                        Full Time
                      </option>

                      <option value="PART_TIME">
                        Part Time
                      </option>

                      <option value="CONTRACT">
                        Contract
                      </option>

                      <option value="INTERNSHIP">
                        Internship
                      </option>

                      <option value="FREELANCE">
                        Freelance
                      </option>
                    </select>

                    <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Work Mode
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      name="workMode"
                      value={jobData.workMode}
                      onChange={handleInput}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="ONSITE">
                        Onsite
                      </option>

                      <option value="REMOTE">
                        Remote
                      </option>

                      <option value="HYBRID">
                        Hybrid
                      </option>
                    </select>

                    <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                  </div>
                </div>

              </div>
            </div>
          </Section>



 <Section
            icon={<FaBuilding />}
            title="Company Information"
            description="Information about the hiring company"
          >
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-[180px_1fr]">

  

              <div>
                <label className={labelClass}>
                  Company Logo
                </label>

                <label className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#153497]">

 { (jobData?.companyLogo && !jobData.image ) ? (<div className='relative aspect-square'>
                    <img
                      src={`${img_url}${jobData?.companyLogo}`}
                      alt="Company Logo"
                      className="h-full w-full object-cover"
                    />
                    <MdCancel  className='absolute top-2 right-2 text-2xl text-red-600  cursor-pointer ' onClick={(e)=>{e.preventDefault(),setJobData((prev: any)=>({...prev,companyLogo:null}))}}/>
                    </div>
                  ) : jobData.image ? <div className='relative aspect-square'><img
                      src={URL.createObjectURL(jobData.image)}
                      alt="Company Logo"
                      className="h-full w-full object-cover"
                    />
                    
                                        <MdCancel  className='absolute top-2 right-2 text-2xl text-red-600  cursor-pointer ' onClick={(e)=>{e.preventDefault(),setJobData((prev: any)=>({...prev,image:null}))}}/>

                    
                     </div> : (
                    <div className="text-center">
                      <FaBuilding className="mx-auto mb-3 text-3xl text-slate-300" />

                      <p className="text-sm font-semibold text-slate-600">
                        Upload Logo
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG/JPG • Max 5MB
                      </p>
                    </div>
                  )}

                  {/* {jobData.image ? (
                    <img
                      src={URL.createObjectURL(jobData.image)}
                      alt="Company Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <FaBuilding className="mx-auto mb-3 text-3xl text-slate-300" />

                      <p className="text-sm font-semibold text-slate-600">
                        Upload Logo
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG/JPG • Max 5MB
                      </p>
                    </div>
                  )} */}
                  

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogo}
                    className="hidden"
                  />
                </label>
              </div>

         

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className={labelClass}>
                    Company Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    name="companyName"
                    value={jobData.companyName}
                    onChange={handleInput}
                    placeholder="Company name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Company Website
                  </label>

                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      name="companyWebsite"
                      value={jobData.companyWebsite}
                      onChange={handleInput}
                      placeholder="https://example.com"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

              </div>
            </div>
          </Section>











  <Section
            icon={<FaBriefcase />}
            title="Category"
            description="Select the category and subcategory"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Category
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <select
                    required
                    name="category"
                    value={jobData.category}
                    onChange={handleInput}
                    disabled={categoryLoading}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">
                      {categoryLoading
                        ? "Loading..."
                        : "-- Select Category --"}
                    </option>

                    {allCategory.map(
                      (item: any) => (
                        <option
                          value={item._id}
                          key={item._id}
                        >
                          {item.title}
                        </option>
                      )
                    )}
                  </select>

                  <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Subcategory
                </label>

                <div className="relative">
                  <select
                    name="subcategory"
                    value={jobData.subcategory}
                    onChange={handleInput}
                    disabled={
                      !jobData.category ||
                      filteredSubCategory.length === 0
                    }
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">
                      {!jobData.category
                        ? "Select category first"
                        : filteredSubCategory.length === 0
                        ? "No subcategory available"
                        : "-- Select Subcategory --"}
                    </option>

                    {filteredSubCategory.map(
                      (item: any) => (
                        <option
                          value={item._id}
                          key={item._id}
                        >
                          {item.title}
                        </option>
                      )
                    )}
                  </select>

                  <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                </div>
              </div>

            </div>
          </Section>


 <Section
            icon={<FaLocationDot />}
            title="Location"
            description="Job location details"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  City
                </label>

                <input
                  name="city"
                  value={jobData.location.city}
                  onChange={handleInputLocation}
                  placeholder="Chandigarh"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  State
                </label>

                <input
                  name="state"
                  value={jobData.location.state}
                  onChange={handleInputLocation}
                  placeholder="Punjab"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Country
                </label>

                <input
                  name="country"
                  value={jobData.location.country}
                  onChange={handleInputLocation}
                  placeholder="India"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Address
                </label>

                <input
                  name="address"
                  value={jobData.location.address}
                  onChange={handleInputLocation}
                  placeholder="Office address"
                  className={inputClass}
                />
              </div>

            </div>
          </Section>

  <Section
            icon={<FaMoneyBill1Wave />}
            title="Experience & Salary"
            description="Define experience requirements and salary"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

           

              <div>
                <label className={labelClass}>
                  Experience
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      name="experienceMin"
                      value={jobData.experience.min}
                      onChange={(e : any)=>setJobData(prev=>({...prev,experience:{...prev.experience,min:e.target.value}}))}
                      placeholder="Min"
                      className={`${inputClass} pr-16`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      Years
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      name="experienceMax"
                      value={jobData.experience.max}
                      onChange={(e : any)=>setJobData(prev=>({...prev,experience:{...prev.experience,max:e.target.value}}))}
                      placeholder="Max"
                      className={`${inputClass} pr-16`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      Years
                    </span>
                  </div>

                </div>
              </div>

             

              <div>
                <label className={labelClass}>
                  Salary
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <input
                    type="number"
                    min="0"
                    name="salaryMin"
                    value={jobData.salary.min}
                      onChange={(e : any)=>setJobData(prev=>({...prev,salary:{...prev.salary,min:e.target.value}}))}
                    placeholder="Minimum"
                    className={inputClass}
                  />

                  <input
                    type="number"
                    min="0"
                    name="salaryMax"
                    value={jobData.salary.max}
                      onChange={(e : any)=>setJobData(prev=>({...prev,salary:{...prev.salary,max:e.target.value}}))}
                    placeholder="Maximum"
                    className={inputClass}
                  />

                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">

                  <div className="relative">
                    <select
                      name="currency"
                      value={jobData.salary.currency}
                      onChange={(e : any)=>setJobData(prev=>({...prev,salary:{...prev.salary,currency:e.target.value}}))}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="INR">
                        INR ₹
                      </option>

                      <option value="USD">
                        USD $
                      </option>

                      <option value="EUR">
                        EUR €
                      </option>

                      <option value="GBP">
                        GBP £
                      </option>
                    </select>

                    <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                  </div>

                  <div className="relative">
                    <select
                      name="salaryPeriod"
                      value={jobData.salary.period}
                      onChange={(e : any)=>setJobData(prev=>({...prev,salary:{...prev.salary,period:e.target.value}}))}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="YEARLY">
                        Yearly
                      </option>

                      <option value="MONTHLY">
                        Monthly
                      </option>

                      <option value="WEEKLY">
                        Weekly
                      </option>

                      <option value="HOURLY">
                        Hourly
                      </option>
                    </select>

                    <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                  </div>

                </div>
              </div>

            </div>
          </Section> 




 <Section
            icon={<FaRocket />}
            title="Skills & Education"
            description="Add required skills and qualifications"
          >
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">


<div>
 <label className={labelClass}>
          <span className="flex items-center gap-2">
           <FaRocket size={13} />
            Skills
          </span>
        </label>


 <div className="flex gap-2">
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => { e.key=="Enter" && ( e.preventDefault(), HandelSkill()  )}}
            placeholder={"e.g. React.js"}
            className={inputClass}
          />

          <button
            type="button"
            onClick={HandelSkill}



            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#153497] text-white transition hover:bg-[#10266f]"
          >
            <FaPlus size={14} />
          </button>
        </div>


{jobData.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobData.skills.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{item}</span>

                  <button
                    type="button"
                    onClick={()=>removeSkill(index as number)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              )
            )}
          </div>
        )}
</div>

<div>
 <label className={labelClass}>
          <span className="flex items-center gap-2">
          <FaGraduationCap size={14} />
            Education
          </span>
        </label>


 <div className="flex gap-2">
          <input
            value={educ}
            onChange={(e) => setEduc(e.target.value)}
            onKeyDown={(e) => { e.key=="Enter" && ( e.preventDefault(), HandelEdu()  )}}
            placeholder={"e.g. B.Tech Computer Science"}
            className={inputClass}
          />

          <button
            type="button"
            onClick={HandelEdu}



            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#153497] text-white transition hover:bg-[#10266f]"
          >
            <FaPlus size={14} />
          </button>
        </div>


{jobData.education.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobData.education.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{item}</span>

                  <button
                    type="button"
                    onClick={()=>removeEduc(index as number)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              )
            )}
          </div>
        )}
</div>
             

              

            </div>
          </Section>





 <Section
            icon={<FaCheck />}
            title="Responsibilities & Requirements"
            description="Define responsibilities and candidate requirements"
          >
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">

                          <div>
 <label className={labelClass}>
          <span className="flex items-center gap-2">
          <FaCheck size={13} />
            Responsibilities
          </span>
        </label>


 <div className="flex gap-2">
          <input
            value={responsibilitie}
            onChange={(e) => setResponsibilities(e.target.value)}
            onKeyDown={(e) => { e.key=="Enter" && ( e.preventDefault(), HandelRes()  )}}
            placeholder={"e.g. Build scalable applications"}
            className={inputClass}
          />

          <button
            type="button"
            onClick={HandelRes}



            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#153497] text-white transition hover:bg-[#10266f]"
          >
            <FaPlus size={14} />
          </button>
        </div>


{jobData.responsibilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobData.responsibilities.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{item}</span>

                  <button
                    type="button"
                    onClick={()=>removeRes(index as number)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              )
            )}
          </div>
        )}
                    </div>




    <div>
 <label className={labelClass}>
          <span className="flex items-center gap-2">
          <FaCircleInfo size={13} />
            Requirements
          </span>
        </label>


 <div className="flex gap-2">
          <input
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            onKeyDown={(e) => { e.key=="Enter" && ( e.preventDefault(), HandelReq()  )}}
            placeholder={"e.g. 2+ years experience"}
            className={inputClass}
          />

          <button
            type="button"
            onClick={HandelReq}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#153497] text-white transition hover:bg-[#10266f]"
          >
            <FaPlus size={14} />
          </button>
        </div>


             {jobData.requirements.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobData.requirements.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{item}</span>

                  <button
                    type="button"
                    onClick={()=>removeReq(index as number)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              )
            )}
          </div>
        )}
                    </div>




            
            

            </div>
          </Section>




 <Section
            icon={<FaMoneyBillWave />}
            title="Benefits"
            description="Add benefits offered to candidates"
          >




   <div>
 <label className={labelClass}>
          <span className="flex items-center gap-2">
          <FaMoneyBillWave size={13} />
            Job Benefits
          </span>
        </label>


 <div className="flex gap-2">
          <input
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            onKeyDown={(e) => { e.key=="Enter" && ( e.preventDefault(), HandelBenif()  )}}
            placeholder={"e.g. Health Insurance"}
            className={inputClass}
          />

          <button
            type="button"
            onClick={HandelBenif}



            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#153497] text-white transition hover:bg-[#10266f]"
          >
            <FaPlus size={14} />
          </button>
        </div>


{jobData.benefits.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobData.benefits.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{item}</span>

                  <button
                    type="button"
                    onClick={()=>removeBenif(index as number)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              )
            )}
          </div>
        )}
                    </div>





          
          </Section>






<Section
            icon={<FaQuestionCircle />}
            title="Questions"
            description="Add Questions ask to candidates"
          >




   <div>
 <label className={labelClass}>
          <span className="flex items-center gap-2">
          <FaQuestionCircle size={13} />
            Job Questions
          </span>
        </label>


 <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { e.key=="Enter" && ( e.preventDefault(), HandelQuestion()  )}}
            placeholder={" Job Questions....."}
            className={inputClass}
          />

          <button
            type="button"
            onClick={HandelQuestion}



            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#153497] text-white transition hover:bg-[#10266f]"
          >
            <FaPlus size={14} />
          </button>
        </div>


{jobData.questions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobData.questions.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{item}</span>

                  <button
                    type="button"
                    onClick={()=>removeQuestion(index as number)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              )
            )}
          </div>
        )}
                    </div>





          
          </Section>






   <Section
            icon={<FaEnvelope />}
            title="Application Details"
            description="Configure how candidates can apply"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Application URL
                </label>

                <div className="relative">
                  <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    name="applicationUrl"
                    value={jobData.applicationUrl}
                    onChange={handleInput}
                    placeholder="https://company.com/apply"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Application Deadline
                </label>

                <div className="relative">
                  <FaCalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    name="applicationDeadline"
                    value={jobData.applicationDeadline?.split("T")[0] || ""}
                    onChange={handleInput}
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Contact Email
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    name="contactEmail"
                    value={jobData.contactEmail}
                    onChange={handleInput}
                    placeholder="hr@company.com"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Contact Phone
                </label>

                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="tel"
                    name="contactPhone"
                    value={jobData.contactPhone}
                    onChange={handleInput}
                    placeholder="+91 9876543210"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Vacancies
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <FaUserGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="number"
                    min="1"
                    name="vacancies"
                    value={jobData.vacancies}
                    onChange={handleInput}
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

            </div>
          </Section>




 
  <Section
            icon={<FaRocket />}
            title="Publishing Settings"
            description="Control job visibility and priority"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

           

              <div>
                <label className={labelClass}>
                  Status
                </label>

                <div className="relative">
                  <select
                    name="status"
                    value={jobData.status}
                    onChange={handleInput}
                    className={`${inputClass} appearance-none`}
                  >

                    {[
        "DRAFT",
        "PENDING",
        "PUBLISHED",
        "CLOSED",
        "REJECTED",
        "EXPIRED",
      ].map((item,ind)=><option key={ind} value={(item)}>{item}</option>)}
                    

                   
                  </select>

                  <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                </div>
              </div>

              

              
  
  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
    <div>
      <p className="text-sm font-semibold text-slate-800">
        Featured Job
      </p>

      <p className="text-xs text-slate-500">
        Highlight this job
      </p>
    </div>

    <div
      onClick={() =>
        handleCheckbox({
          target: {
            name: "isFeatured",
            checked: !jobData.isFeatured,
          },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
        jobData.isFeatured
          ? "bg-[#153497]"
          : "bg-slate-300"
      }`}
    >
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          jobData.isFeatured
            ? "translate-x-6"
            : "translate-x-1"
        }`}
      />
    </div>
  </label>

  
  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
    <div>
      <p className="text-sm font-semibold text-slate-800">
        Urgent Hiring
      </p>

      <p className="text-xs text-slate-500">
        Mark as urgent
      </p>
    </div>

    <div
      onClick={() =>
        handleCheckbox({
          target: {
            name: "isUrgent",
            checked: !jobData.isUrgent,
          },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
        jobData.isUrgent
          ? "bg-red-500"
          : "bg-slate-300"
      }`}
    >
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          jobData.isUrgent
            ? "translate-x-6"
            : "translate-x-1"
        }`}
      />
    </div>
  </label>

            </div>
          </Section>

 <div className="sticky bottom-4 z-30 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  Ready to create this job?
                </p>

                <p className="text-xs text-slate-500">
                  Review the information before submitting.
                </p>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    router.back()
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:flex-none"
                >
                  <FaXmark size={14} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#153497] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#153497]/20 transition hover:bg-[#10266f] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Editing...
                    </>
                  ) : (
                    <>
                      <FaFloppyDisk size={14} />

                      Edit Job
                    </>
                  )}
                </button>

              </div>
            </div>
          </div> 

</form>
  </div>
 </div> )
}

export default page


const Section = ({
    icon,
    title,
    description,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#153497]/10 text-[#153497]">
              {icon}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {title}
              </h2>

              {description && (
                <p className="mt-1 text-sm text-slate-500">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          {children}
        </div>
      </section>
    );
  };


