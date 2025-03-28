'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/config/config'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
function page() {
    const {user} = useAuth()
    const [name, setName] = useState(user?.name)
    const [disabled, setDisabled] = useState({
        name:true,
        password:true
    })
    const [loading, setLoading] = useState({
        name:false,
        password:false
    })
    const [password, setPassword] = useState({
        old:'',
        new:'',
        confirm:''
    })

    useEffect(()=>{
        if(name === user?.name || name?.length == 0 || loading.name){
            setDisabled({...disabled, name:true})
        }else{
            setDisabled({...disabled, name:false})
        }
    },[name, loading.name])

    useEffect(()=>{
        if(password.old.length == 0 || password.new.length == 0 || password.confirm.length == 0 || password.new != password.confirm || loading.password){
            setDisabled({...disabled, password:true})
        }else{
            setDisabled({...disabled, password:false})
        }
    },[password, loading.password])

    const nameUpdateClick = async()=>{
        setLoading({...loading, name:true})
        try {
            const response = await api.patch('/user/me', {name})
            if(response.status === 200){
                setName(response.data.data.name)
                toast.success("Name updated successfully")
            }

        } catch (error) {
            if(error instanceof AxiosError){
                toast.error(error.response?.data.error || "Something went wrong, please try again later")
            }else{
                toast.error("Something went wrong, please try again later")
            }
        }
        finally{
            setLoading({...loading, name:false})
        }
    }

    const passwordUpdateClick = async()=>{
        setLoading({...loading, password:true})
        try {
            if(password.new !== password.confirm){
                return
            }
            const response = await api.post('/user/me/update-password', {oldPassword: password.old, newPassword: password.new})
            if(response.status === 200){
                setPassword({
                    old:'',
                    new:'',
                    confirm:''
                })
                toast.success("Password updated successfully")
            }

        } catch (error) {
            if(error instanceof AxiosError){
                toast.error(error.response?.data.error || "Something went wrong, please try again later")
            }else{
                toast.error("Something went wrong, please try again later")
            }
        }
        finally{
            setLoading({...loading, password:false})
        }
    }
    
  return (
    <div className='m-5 flex flex-col gap-4'>
        <Card>
            <CardHeader>
            <CardTitle>Name</CardTitle>
            </CardHeader>
            <CardContent>
                <Input value={name} onChange={(e)=>setName(e.target.value)}/>
            </CardContent>
            <CardFooter className='justify-end'>
                <Button disabled={disabled.name} onClick={nameUpdateClick}>Update</Button>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{user?.email}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>Credits Used</CardTitle>
            <CardDescription>Number of AI Summary Generations used this month</CardDescription>
            </CardHeader>
            <CardContent>
                <span className={`${user?.creditsUsed! > 3 ? "text-red-500" : user?.creditsUsed! > 1 ? "text-yellow-500" : "text-green-500"}`}>{user?.creditsUsed} </span><span> / 5</span> 
            </CardContent>
        </Card>
        {user?.loginType == "email" && <Card>
            <CardHeader>
            <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <Input type='password' value={password.old} onChange={(e)=>{
                    setPassword({...password, old:e.target.value})
                }} placeholder='Old Password'/>
                <Input type='password' value={password.new} onChange={(e)=>{
                    setPassword({...password, new:e.target.value})
                 }} placeholder='New Password'/>
                <Input type='password' value={password.confirm} onChange={(e)=>{
                    setPassword({...password, confirm:e.target.value})
                 }} placeholder='Confirm New Password'/>
            </CardContent>
            <CardFooter className='justify-end'>
                <Button disabled={disabled.password || loading.password} onClick={passwordUpdateClick}>Update</Button>
            </CardFooter>
        </Card>}

        {/*Contact Card */}

        <Card>
            <CardHeader>
            <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
                <p>For any queries or feedback, please contact <a className='text-blue-400 underline' href="https://mail.google.com/mail/?view=cm&fs=1&to=vignesh.d9123@gmail.com&su=NoteFlix" target='_blank'>
                    vignesh.d9123@gmail.com
                </a> 
                </p>
                <p>Connect with me on <a className='text-blue-400 underline' href='https://www.linkedin.com/in/vignesh-d-mys' target='_blank'>Linkedin</a></p>
            </CardContent>
        </Card>
      

    </div>
  )
}

export default page
