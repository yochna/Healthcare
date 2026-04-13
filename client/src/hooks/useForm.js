import { useState, useCallback } from "react";

export function useForm(initialState,apiEndpoint){
    const [form,setForm] = useState(initialState);
    const [status,setStatus] = useState('idle');
    const[result,setResult] = useState(null);
    const[error,setError] = useState(null);

    const API = process.env.REACT_APP_API_URL||'';
    const handleChange = useCallback(e =>{
        setForm(prev =>({
            ...prev,
            [e.target.name]:e.target.value
        }));
    },[])


    const handleSubmit = useCallback(async e=>{
        e.preventDefault();
        setStatus('Loading');
        setError(null);

        try{
            const response = await fetch(`${API}${apiEndpoint}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(form)
            });

            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error || 'Submission failed');
            }

            setResult(data);
            setStatus('success');
            setForm(initialState);

            return data;
        }catch(err){
            setError(err.message);
            setStatus('error');
        }
    },[form,apiEndpoint,API,initialState])



    const resetForm = useCallback(()=>{
        setForm(initialState);
        setStatus('idle');
        setResult(null);
        setError(null)
    },[initialState])


    return {
        form,
        setForm,
        status,
        result,
        error,
        handleChange,
        handleSubmit,
        resetForm
    }
}