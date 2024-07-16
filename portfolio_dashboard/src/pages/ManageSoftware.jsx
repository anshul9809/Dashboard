import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    clearAllSoftwareAppErrors,
    addNewSoftwareApplication,
    deleteSoftwareApplication,
    getAllSoftwareApplications,
    resetSoftwareApplicationSlice, 
} from "@/store/slices/softwareApplicationSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

const ManageSoftware = () => {
  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };
  const { loading, softwareApplications, error, message } = useSelector(
    (state) => state.softwareApplications
  );
  const dispatch = useDispatch();

  const [newProficiency, setNewProficiency] = useState(1);
  const handleInputChange = (proficiency) => {
    setNewProficiency(proficiency);
  };

  const handleDeleteSoftware = (id) => {
    dispatch(deleteSoftwareApplication(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllSoftwareAppErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetSoftwareApplicationSlice());
      dispatch(getAllSoftwareApplications());
    }
  }, [dispatch, loading, error]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Tabs defaultValue="week">
        <TabsContent value="week">
          <Card>
            <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
              <CardTitle>Manage Your Softwares</CardTitle>
              <Button className="w-fit" onClick={handleReturnToDashboard}>
                Return to Dashboard
              </Button>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {softwareApplications.map((element) => {
                return (
                  <Card key={element._id}>
                    <CardHeader className="text-3xl font-bold flex items-center justify-between flex-row">
                      {element.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash2
                              onClick={() => handleDeleteSoftware(element._id)}
                              className="h-5 w-5 hover:text-red-500"
                            />
                          </TooltipTrigger>
                          <TooltipContent side="right" style={{ color: "red" }}>
                            Delete
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardHeader>
                    <CardFooter>
                      <Label className="text-2xl mr-2">Proficiency:</Label>
                      <Input
                        type="number"
                        defaultValue={element.proficiency}
                        onChange={(e) => handleInputChange(e.target.value)}
                      />
                    </CardFooter>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageSoftware;
