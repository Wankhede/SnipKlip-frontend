import { useState, useEffect } from 'react';

// material-ui
import { CardContent, Checkbox, FormControlLabel, Grid, Tooltip } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';

// assets
import { PlusCircleOutlined } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';

// ===========================|| DATA WIDGET - TODO LIST ||=========================== //
// Define the type for a single task
type Task = {
  label: string;
  checked: boolean;
};
const ToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch data from the backend API
    fetchDataFromBackend();
  }, []); // Empty dependency array ensures that this effect runs only once after the component mounts

  const handleChangeState = (event:any, index:number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].checked = event.target.checked;
    setTasks(updatedTasks);
  };

  const fetchDataFromBackend = () => {
    // Replace 'YOUR_BACKEND_API_ENDPOINT' with the actual API endpoint URL
    // axiosServices
    //   .get('YOUR_BACKEND_API_ENDPOINT')
    //   .then((response) => {
    //     setTasks(response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching data from the backend:', error);
    //   });

      setTasks([]);
  };

  return (
    <MainCard
      title="To Do List"
      content={false}
      secondary={
        <Tooltip title="Add Task">
          <IconButton>
            <PlusCircleOutlined />
          </IconButton>
        </Tooltip>
      }
      sx={{ '& .MuiCardHeader-root': { p: 1.75 } }}
    >
      <CardContent>
        <Grid container spacing={0} sx={{ '& .Mui-checked + span': { textDecoration: 'line-through' } }}>
          {tasks.map((task, index) => (
            <Grid item xs={12} key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={task.checked}
                    onChange={(event) => handleChangeState(event, index)}
                    name={`checked${index}`}
                    color="primary"
                  />
                }
                label={task.label}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default ToDoList;
