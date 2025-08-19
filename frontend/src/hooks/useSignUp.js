import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({        
    mutationFn: signup,
    // Mark "authUser" data as stale so React Query refetches it,
// updating the UI with the latest user info after signup.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { isPending, error, signupMutation: mutate };
};

// signupData (from form)  // from the usestate of the signupdata
//     ⬇  
// signupMutation(signupData)  // calls mutate(data)   this will give the data that was taken from the usestate to the mutate to the line 12
//     ⬇  
// mutationFn: signup(data)    // React Query passes it in  
//     ⬇  
// API request with that data in the body
export default useSignUp;