import React, {useEffect} from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent, CircularProgress,
  Grid,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import {spacing} from "@mui/system";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import {getCategoryByGroupId} from "../../../api/category";
import {getUnitsByGroup} from "../../../api/unit";
import {getCarrierById, newCarrier, updateCarrier} from "../../../api/carrier";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const themeCustom = createTheme({
  palette: {
    custom_black: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
    custom_green: {
      main: "#23A295",
      contrastText: "#FFFFFF",
    }
  },
});

const NewCarrier = () => {
  const navigate = useNavigate();
  let { id } = useParams();

  const {
    data,
    isLoading,
    isError
  } = useQuery(["getCarrierById", id], getCarrierById, {
    enabled: !!id,
  });
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery(["getCategoryByGroupId", 1], getCategoryByGroupId);
  const {
    data: units,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useQuery(["getUnitsByGroup", 1], getUnitsByGroup);
  const mutation = useMutation({ mutationFn: newCarrier });
  const updateMutation = useMutation({ mutationFn: updateCarrier });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      unit: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
      unit: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm,  setSubmitting }) => {
      try {
        if (id) {
          values.id = id;
          await updateMutation.mutateAsync(values);
        } else {
          await mutation.mutateAsync(values);
        }
        toast("Successfully Created a Carrier", {
          type: "success",
        });
        navigate("/master-data-registry/carriers");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    }
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoading && !isError) {
        formik.setValues({
          name: data.data.name,
          description: data.data.description ? data.data.description : "",
          category: data.data.category,
          unit: data.data.unit,
        });
      }
    }
    setCurrentFormValues();
  }, [isLoading, isError, data]);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Card mb={12}>
          <CardContent>
            {formik.isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={12}>
                  <Grid item md={12}>
                    <Typography variant="h3" gutterBottom display="inline" sx={{ color: "#23A295;" }}>
                      Master Data Registry
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      New Carrier
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
                    <TextField
                      name="name"
                      label="Carrier Name"
                      value={formik.values.name}
                      error={Boolean(
                        formik.touched.name && formik.errors.name
                      )}
                      fullWidth
                      helperText={
                        formik.touched.name && formik.errors.name
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <TextField
                      name="category"
                      label="Category"
                      select
                      value={formik.values.category}
                      error={Boolean(
                        formik.touched.category && formik.errors.category
                      )}
                      helperText={
                        formik.touched.category && formik.errors.category
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Carrier Category
                      </MenuItem>
                      {!isLoadingCategories && !isErrorCategories
                        ? categories.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                        : []}
                    </TextField>
                  </Grid>

                  <Grid item md={6}>
                    <TextField
                      name="unit"
                      label="Unit"
                      select
                      value={formik.values.unit}
                      error={Boolean(
                        formik.touched.unit && formik.errors.unit
                      )}
                      helperText={
                        formik.touched.unit && formik.errors.unit
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Carrier Unit
                      </MenuItem>
                      {!isLoadingUnits && !isErrorUnits
                        ? units.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                        : []}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
                    <TextField
                      name="description"
                      label="Description"
                      value={formik.values.description}
                      error={Boolean(
                        formik.touched.description && formik.errors.description
                      )}
                      fullWidth
                      helperText={
                        formik.touched.description && formik.errors.description
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      multiline
                      variant="outlined"
                      rows={3}
                      my={2}
                    />
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={2}>
                  <ThemeProvider theme={themeCustom}>
                    <Button type="submit" variant="contained" color="custom_black" onClick={() => navigate("/master-data-registry/carriers")}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="custom_green">
                      Save New Carrier
                    </Button>
                  </ThemeProvider>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      </form>
    </React.Fragment>
  );
};
export default NewCarrier;