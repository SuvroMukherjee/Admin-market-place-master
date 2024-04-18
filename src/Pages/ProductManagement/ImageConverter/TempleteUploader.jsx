import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { allBrandList, allCategoryList, allSubCategoryList } from '../../../API/api';

const TemplateUploader = () => {
    const [copied, setCopied] = useState(false);
    const [category,setcategory] = useState('')
    const [copiedCat, setCopiedCat] = useState(false);
    const [Subcategory, Subsetcategory] = useState('')
    const [SubcopiedCat, SubsetCopiedCat] = useState(false);
    const [brands, setbrands] = useState('')
    const [brandcopied, setBrandcopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500); // Reset copied state after 1.5 seconds
    };

    const handleCopyCat  = async() =>{
        await allCategoryList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item) => item?.title);
            const categoryString = dataWithUniqueIds?.join('\n');
            console.log(categoryString);
            setcategory(categoryString);
            setCopiedCat(true);
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
        })
    }

    const handleCopySubCat = async () => {
        await allSubCategoryList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item) => item?.title);
            const subcategoryString = dataWithUniqueIds?.join('\n');
            console.log(subcategoryString);
            Subsetcategory(subcategoryString);
            SubsetCopiedCat(true);
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
        })
    }

    const handleCopyBrand = async () => {
        await allBrandList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item) => item?.title);
            const brandstring = dataWithUniqueIds?.join('\n');
            console.log(brandstring);
            setbrands(brandstring);
            setBrandcopied(true);
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
        })
    }

    return (
        <div className="productList mt-2 p-4">
            <Container>
                <Row>
                    <Col xs={6}>
                        <input type='file' />
                    </Col>
                    <Col xs={4}>
                        <Row className='mt-2'>
                            <CopyToClipboard text={category} onCopy={handleCopyCat}>
                                <Button size='sm' variant='outline-dark'>{copiedCat ? 'Copied!' : 'Copy All Categories'}</Button>
                            </CopyToClipboard>
                        </Row>

                        {category  && 
                        <Row className='p-2 mt-1' style={{background:'wheat',fontSize:'10px'}}>
                            {category}
                        </Row>}

                        <Row className='mt-2'>
                            <CopyToClipboard text={Subcategory} onCopy={handleCopySubCat}>
                                <Button size='sm' variant='outline-dark'>{SubcopiedCat ? 'Copied!' : 'Copy All Sub-Categories'}</Button>
                            </CopyToClipboard>
                        </Row>

                        {Subcategory &&
                            <Row className='p-2 mt-1' style={{ background: 'wheat', fontSize: '10px' }}>
                                {Subcategory}
                            </Row>}

                        <Row className='mt-2'>
                            <CopyToClipboard text={brands} onCopy={handleCopyBrand}>
                                <Button size='sm' variant='outline-dark'>{brandcopied ? 'Copied!' : 'Copy All Brands'}</Button>
                            </CopyToClipboard>
                        </Row>

                        {brands &&
                            <Row className='p-2 mt-1' style={{ background: 'wheat', fontSize: '10px' }}>
                                {brands}
                            </Row>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TemplateUploader;
