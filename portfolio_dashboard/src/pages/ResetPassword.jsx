import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllForgotResetPassErrors, resetPassword } from "@/store/slices/forgotPasswordResetSlice";
import { toast } from "react-toastify";
import { getUser } from "@/store/slices/userSlice";

const ResetPassword = ()=> {

  const {token} = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigateTo  = useNavigate();
  const dispatch = useDispatch();
  const {loading, error, message} = useSelector(state=>state.forgotPassword);
  const { isAuthenticated } = useSelector(state=>state.user);
  const handleResetPassword = ()=>{
    dispatch(resetPassword(token, password, confirmPassword))
  }
  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(clearAllForgotResetPassErrors());
    }
    if(isAuthenticated){
      navigateTo("/")
    }
    if(message){
      toast.success(message);
      dispatch(getUser())
    }
  }, [dispatch, isAuthenticated, error, loading]);
  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="min-h-[100vh] flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 rounded-xl border-black border-2 p-3">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-balance text-muted-foreground">
              Enter Password and confirm password
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                required
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Confirm Password</Label>
                
              </div>
              <Input id="confirmPassword" type="password" required  
                placeholder="password"
                onChange={(e)=>setConfirmPassword(e.target.value)}
                value={confirmPassword}
                />
            </div>
            {loading?(
            <SpecialLoadingButton content={"Resetting Password"}  />
            ):
            (<Button type="submit" className="w-full" onClick={handleResetPassword}>
              Reset Password
            </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-muted">
        <img src="/login.png" alt="login" />
      </div>
    </div>
  )
}

export default ResetPassword;