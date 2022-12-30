import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import FormSheet from '../src/components/FormSheet';
import React from "react";
configure({ adapter: new Adapter() });

const findTheElement = (wrapper,type) => {
  return  wrapper.findWhere(node=>node.prop("data-test") === type)
}

describe("Render the Form Sheet",()=>{
    it("initial render",()=>{
        const wrapper = shallow(<FormSheet/>)
        const parentElement =findTheElement(wrapper,"mainContainer")
        expect(parentElement.children().length).toBe(2)
    })
    it("initial render",()=>{
        const wrapper = shallow(<FormSheet/>)
        const button =findTheElement(wrapper,"submit")
        button.simulate("click")
    })
})