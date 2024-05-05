import { getExercisesByPageDataApi } from "@/services/exerciseApi";
import { useEffect } from "react";

const Exercise: React.FC = () => {

  useEffect(()=> {
    getExercisesByPageDataApi().then(res => {
      console.log(res);
    })
  }, [])
  return (
    <div className='p-4'>
      
    </div>
  );
};

export default Exercise;
