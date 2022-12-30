import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Col, Form, Row } from 'react-bootstrap';
import {
  axiosGetCall,
  axiosPostsCall,
} from '../network/API/apiCalls';
import {
  cityEndpoint,
  countryEndpoint,
  registerEndpoint,
  stateEndpoint,
} from '../network/API/endPoints';
import AlertMessage from './AlertMessage';

const FormSheet = () => {
  const [mockData, setMockData] = useState({
    country: [],
    state: [],
    city: [],
  });

  const [alertStatus,setStatus] = useState({
    status:false,
    message:"",
    variant:""
  })

  const handleApiCalls = (method, endpoint, type, payload) => {
    switch (method) {
      case 'Get':
        axiosGetCall(endpoint).then((response) =>
          setMockData((prev) => ({ ...prev, [type]: response }))
        );
        return;
      case 'Post':
        axiosPostsCall(endpoint, payload).then((response) =>
          setMockData((prev) => ({ ...prev, [type]: response }))
        );
        return;
      case "submit":
       return axiosPostsCall(registerEndpoint, payload)
      default:
        break;
    }
  };

  const handleFromSubmit = (data) => {
     handleApiCalls("submit","","",data).then((response)=>{
        setStatus({status:true,variant:"success",message:response.message})
     }).catch(()=>{
        setStatus({status:true,variant:"danger",message:"Something went wrong"})
     })
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Please Enter name'),
    last_name: Yup.string().required('Please Enter name'),
    email: Yup.string()
      .email('Enter the valid email.')
      .required('Enter your email id'),
    address1: Yup.string().required('Please Enter Your Address'),
    address2: Yup.string().required('Please Enter your address'),
    country: Yup.string().required('Please select country'),
    state: Yup.string().required('Please select State'),
    city: Yup.string().required('Please select city'),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm({
    mode: 'all',
    shouldUnregister: true,
    resolver: yupResolver(validationSchema),
  });

  const value = getValues();

  const getCountryCode = (countryName) => {
    let code = '';
    if (countryName) {
      const countryData = mockData.country.find(
        (doc) => doc.name === countryName
      );
      code = countryData.code;
    }
    return code;
  };

  const handleChange = (e, values) => {
    const { name } = e.target;
    const code =
      e.target.options[e.target.selectedIndex].dataset.code;
    let payload = {};
    if (name === 'country') {
      payload = { country_code: code };
    } else if (name === 'state') {
      payload = {
        country_code: getCountryCode(values.country),
        state_code: code,
      };
    }
    const isCountry = name === 'country';
    handleApiCalls(
      'Post',
      isCountry ? stateEndpoint : cityEndpoint,
      isCountry ? 'state' : 'city',
      payload
    );
  };

  useEffect(() => {
    handleApiCalls('Get', countryEndpoint, 'country');
  }, []);

  useEffect(() => {
    if(alertStatus.status){
      setTimeout(() => {
        setStatus({status:false,message:"",variant:""})
      }, 3000);
    } 
  }, [alertStatus])
  
  return (
    <main className="w-100 vh-100 d-flex flex-column  align-items-center justify-content-center" data-test="mainContainer" >
       {
        alertStatus.status && <AlertMessage variant={alertStatus.variant} message={alertStatus.message} />
       }
      <header className="w-50 my-2">
        <h3>Create A New Account</h3>
      </header>
      <section className="w-50">
        <Form onSubmit={handleSubmit(handleFromSubmit)}>
          <Row>
            <Col lg={6}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                {...register('first_name')}
                isInvalid={Boolean(errors && errors.firstName)}
              />
              <Form.Control.Feedback type="invalid">
                {errors &&
                  errors.firstName &&
                  errors.firstName.message}
              </Form.Control.Feedback>
            </Col>
            <Col lg={6}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                {...register('last_name')}
                isInvalid={Boolean(errors && errors.lastName)}
              />
              <Form.Control.Feedback type="invalid">
                {errors && errors.lastName && errors.lastName.message}
              </Form.Control.Feedback>
            </Col>
            <Col lg={12}>
              <Form.Label>Email Id</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter last name"
                {...register('email')}
                isInvalid={Boolean(errors && errors.email)}
              />
              <Form.Control.Feedback type="invalid">
                {errors && errors.email && errors.email.message}
              </Form.Control.Feedback>
            </Col>
            <div className="separater mt-5">
              <h6 className="font-weight-bold">Address</h6>
            </div>
            <Col lg={6}>
              <Form.Label>Address 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address 1"
                {...register('address1')}
                isInvalid={Boolean(errors && errors.address1)}
              />
              <Form.Control.Feedback type="invalid">
                {errors && errors.address1 && errors.address1.message}
              </Form.Control.Feedback>
            </Col>
            <Col lg={6}>
              <Form.Label>Address 2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address 2"
                {...register('address2')}
                isInvalid={Boolean(errors && errors.address2)}
              />
              <Form.Control.Feedback type="invalid">
                {errors && errors.address2 && errors.address2.message}
              </Form.Control.Feedback>
            </Col>
            <Col lg={12}>
              <Form.Label>Country</Form.Label>
              <Form.Select
                className="text-secondary"
                {...register('country', { onChange: handleChange })}
                isInvalid={Boolean(errors && errors.country)}
              >
                <option value="">Please Select any country</option>
                {mockData.country.length > 0 &&
                  mockData.country.map((country, index) => {
                    return (
                      <option
                        key={`country-${index}`}
                        data-code={country.code}
                        value={country.name}
                      >
                        {country.name}
                      </option>
                    );
                  })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors && errors.country && errors.country.message}
              </Form.Control.Feedback>
            </Col>
            <Col lg={12}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Select
                  className="text-secondary"
                  {...register('state', {
                    onChange: (e) => handleChange(e, value),
                  })}
                  isInvalid={Boolean(errors && errors.state)}
                >
                  <option value="">Please Select any State</option>
                  {mockData.state.length > 0 &&
                    mockData.state.map((states, index) => {
                      return (
                        <option
                          key={`state-${index}`}
                          value={states.name}
                          data-code={states.state_code}
                        >
                          {states.name}
                        </option>
                      );
                    })}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors && errors.state && errors.state.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={12} className="mb-4">
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Select
                  className="text-secondary"
                  {...register('city')}
                  isInvalid={Boolean(errors && errors.city)}
                >
                  <option value="">Please Select any city</option>
                  {mockData.city.length > 0 &&
                    mockData.city.map((city, index) => {
                      return (
                        <option
                          key={`city-${index}`}
                          value={city.name}
                        >
                          {city.name}
                        </option>
                      );
                    })}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors && errors.city && errors.city.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={12} className="text-end">
              <Button variant="secondary" type="submit" data-test="submit" >
                Create Account
              </Button>
            </Col>
          </Row>
        </Form>
      </section>
    </main>
  );
};

export default FormSheet;
