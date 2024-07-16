import {Link, useNavigate} from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllForgotResetPassErrors, forgotPassword } from "@/store/slices/forgotPasswordResetSlice";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
const ForgotPassword = ()=>{
  const [email, setEmail] = useState("");
  const {loading, error, message} = useSelector((state)=>state.forgotPassword);
  const {isAuthenticated} = useSelector(state=>state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const  handleForgotPassword = ()=>{
    dispatch(forgotPassword(email));
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
    }
  }, [dispatch, isAuthenticated, error, loading]);
    return (
        <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="min-h-[100vh] flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 rounded-xl border-black border-2 p-3">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="ml-auto inline-block text-sm underline"
                >
                  Remember your password?
                </Link>
              </div>
            </div>
            {loading?(
            <SpecialLoadingButton content={"Sending mail"}  />
            ):
            (<Button type="submit" className="w-full" onClick={handleForgotPassword}>
              Send Mail
            </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-muted">
        <img src="/login.png" alt="login" />
      </div>
    </div>
    );
}

export default ForgotPassword;