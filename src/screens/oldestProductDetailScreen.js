import React, { useEffect, useRef } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    useWindowDimensions,
    Modal,
    Image
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixContent, OtrixDivider, OtirxBackButton, OtrixLoader, SimilarProduct, OtrixAlert, RatingComponent
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { bottomCart, checkround2, close } from '@common';
import { SliderBox } from 'react-native-image-slider-box';
import { Badge, ScrollView, Button } from "native-base";
import Fonts from "../helpers/Fonts";
import { bindActionCreators } from "redux";
import { addToCart, addToWishList } from '@actions';
import Icon from 'react-native-vector-icons/AntDesign'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import Stars from 'react-native-stars';
import RenderHtml from 'react-native-render-html';
import getApi from "@apis/getApi";
import { numberWithComma, logfunction, _addToWishlist } from "@helpers/FunctionHelper";
import { ASSETS_DIR, CURRENCY } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';

function ProductDetailScreen(props) {
    const scrollRight = useRef();

    const [state, setState] = React.useState({ loading: true, productPrice: 0, productCount: 1, productDetail: null, value: null, isFocus: false, productDescription: null, productSpecial: null, productAttributes: null, productImages: null, productRelated: null, productOption: [], fetchCart: false, productReview: null, optionColor: 0, optionSelect: 0, optionSize: 0, showZoom: false, zoomImages: [], message: null, type: 'error', optionColorPrice: 0, optionSelectPrice: 0, optionSizePrice: 0, });
    const { loading, productDetail, productOption, productPrice, fetchCart, productReview, productImages, productAttributes, productDescription, isFocus, productRelated, productSpecial, optionColor, optionSelect, optionSize, productCount, zoomImages, showZoom, msg, optionColorPrice, optionSelectPrice, optionSizePrice, message, type } = state;

    const _CartData = () => {
        // setState({ ...state, fetchCart: false })
    }

    const showOutofStock = () => {
        setTimeout(() => {
            setState({ ...state, message: null });
        }, 2500);
        setState({ ...state, message: 'Product out of stock', type: 'error' });
    }

    const _addToCart = () => {
        if (USER_AUTH == true) {
            setState({ ...state, fetchCart: true })

            let sendData = new FormData();
            // sendData.append('quantity', productCount)
            sendData.append('product_id', productDetail.id)
            sendData.append('options', JSON.stringify({ "optionColorSelected": optionColor, "optionSizeSelected": optionSize, "optionSelectSelected": optionSelect }))
            logfunction("Sample requrest  ", sendData);
            // getApi.postData(
            //     'user/addToCart',
            //     sendData,
            // ).then((response => {
            //     logfunction("response response  ", response);

            //     if (response.status == 1) {
            //         props.addToCart(response.cartCount);
            //         setState({
            //             ...state,
            //             message: response.message,
            //             fetchCart: false,
            //             type: 'success'
            //         });
            //     }
            //     else {
            //         setState({
            //             ...state,
            //             message: response.message,
            //             fetchCart: false,
            //             type: 'error'
            //         });
            //     }

            //     setTimeout(() => {
            //         setState({
            //             ...state,
            //             message: null,
            //         })
            //     }, 3000);
            // }));
        }
        // else {
        //     props.navigation.navigate('LoginScreen');
        // }


    }

    const addToWish = async (id) => {
        let wishlistData = await _addToWishlist(id);
        props.addToWishList(wishlistData, id);
    }

    const colorChange = (data) => {
        logfunction("COlor Data ", data)
        let calculatePrice = parseFloat(productPrice);
        calculatePrice = calculatePrice - parseFloat(optionColorPrice);

        if (data.price != null) {
            calculatePrice = calculatePrice + parseFloat(data.price);
        }

        logfunction("Final Price ", calculatePrice)
        setState({
            ...state,
            optionColor: data.product_option_id,
            productPrice: calculatePrice,
            optionColorPrice: data.price
        });
    }

    const sizeChange = (data) => {
        logfunction("COlor Data ", data)
        let calculatePrice = parseFloat(productPrice);
        calculatePrice = calculatePrice - parseFloat(optionSizePrice);

        if (data.price != null) {
            calculatePrice = calculatePrice + parseFloat(data.price);
        }

        logfunction("Final Price ", calculatePrice)
        setState({
            ...state,
            optionSize: data.product_option_id,
            productPrice: calculatePrice,
            optionSizePrice: data.price
        });
    }

    const setOptionSelect = (selected, data) => {
        logfunction("Select Data ", data)
        let calculatePrice = parseFloat(productPrice);
        calculatePrice = calculatePrice - optionSelectPrice;

        if (data.price != null) {
            calculatePrice = calculatePrice + parseFloat(data.price);
        }

        logfunction("Final Price ", calculatePrice)
        setState({
            ...state,
            optionSelect: selected,
            productPrice: calculatePrice,
            optionSelectPrice: data.price
        });
    }


    let optionArr = [];
    const buildSelect = (item, index) => {
        let label = item.price != null ? item.label + ' (+' + item.price + ')' : item.label;
        optionArr.push({ price: item.price, label: label, value: item.product_option_id });
        let last = Object.keys(productOption).length - 1;
        if (index == last) {
            return <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                iconStyle={styles.iconStyle}
                data={optionArr}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={optionSelect}
                onChange={item => {
                    setOptionSelect(item.value, item);
                }}
                renderLeftIcon={() => (
                    <Icon
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name="Safety"
                        size={20}
                    />
                )}
            />
        }
    }

    useEffect(() => {
        const { id } = props.route.params;
        logfunction("PRODUCT ID ", id)
        getApi.postData(
            'incrementProductView/' + id,
            [],
        ).then((response => { }));
        logfunction('Product detail  ', 'productDetail/' + id)
        getApi.getData(
            'productDetail/' + id,
            [],
        ).then((response => {
            logfunction("RESPONSE DETAIL ", response)
            let productData = response.data;
            console.log('Product detail----------------------  ',response.data)

            //product details 
            let images = [];
            let zoomImages = [];
            console.log('photo-----------',productData.productOptions[0].photo)
            if (productData.productOptions[0].photo!= null) {
                images.push(ASSETS_DIR  + productData.productOptions[0].photo);
                zoomImages.push({
                    url: ASSETS_DIR + productData.productOptions[0].photo
                });
            }
            else {
                images.push(ASSETS_DIR + '/assets/img/default.png');
                zoomImages.push({
                    url: ASSETS_DIR + '/assets/img/default.png'
                });
            }
            console.log('photo Images-----------',productData.productImages)
            console.log('photo Images-----------', typeof productData.productImages)
            let text = productData.productImages;

            console.log('photo text----------',text)

            const myArray = text.split(",");
            console.log('photo myArray----------',myArray)

            logfunction("OPTIONS", myArray.length)
           
                for (let i = 0; i < myArray.length; i++) { 
                    console.log(myArray[i])
                    images.push(ASSETS_DIR  + myArray[i]);
                    zoomImages.push({
                        url: ASSETS_DIR +  myArray[i].photo
                    }
                    
                    
                    );
                }
            

            let special = 0;

      

            setState({
                ...state,
                productDetail: productData.data,
                productDescription: productData.productOptions[0].description,
                productPrice: productData.productOptions[0].price,
                // basePrice: productData.productOptions[0].price,
                // productSpecial: special,
                // productRelated: productData.reletedProducts,
                // productAttributes: productData.productAttributes,
                productImages: text,
                // productOption: productData.productOptions,
                // zoomImages: zoomImages,
                productReview: { totalReview: productData.totalReviews, avgRating: productData.avgReview, star1: productData.star1, star2: productData.star2, star3: productData.star3, star4: productData.star4, star5: productData.star5 },
                loading: false
            });
            // logfunction("PRODUCT DETAIL ", parseFloat(productData.avgReview))
            // logfunction("productData.productRelatedAttribute ", productData.productAttributes)

        }));

    }, [_CartData()]);

    console.log(' productImages---------------------', productImages);

    const { cartCount, USER_AUTH, wishlistData } = props;
    const { width } = useWindowDimensions();
    const tagsStyles = {
        p: {
            color: Colors.secondry_text_color,
            fontFamily: Fonts.Font_Reguler,
            fontSize: wp('3.5%'),
            lineHeight: hp('2.4%'),
        }
    };

    return (
        <Text> {productData.productImages} </Text>
    )
}

function mapStateToProps(state) {
    return {
        cartCount: state.cart.cartCount,
        wishlistData: state.wishlist.wishlistData,
        USER_AUTH: state.auth.USER_AUTH,

    }
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addToCart,
        addToWishList
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailScreen);

const styles = StyleSheet.create({
    productDetailView: {
        backgroundColor: Colors.white,
        marginHorizontal: 0,
        borderTopRightRadius: wp('13%'),
        borderTopLeftRadius: wp('13%')
    },
    container: {
        height: hp('35%'),
        position: 'relative',
        backgroundColor: Colors.light_white,
        zIndex: 99
    },
    childView: {
        marginHorizontal: wp('5%'),
        paddingBottom: hp('1.8%')
    },
    menuImage: {
        width: wp('6%'),
        height: hp('6%'),
        resizeMode: 'contain',
        tintColor: Colors.themeColor
    },
    colorView: {
        flexDirection: 'row',
        flex: 1,
    },
    colorContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    containerTxt: {
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors.secondry_text_color,
        textAlign: 'left',

    },
    box: {
        height: hp('3.5%'),
        width: wp('13%'),
        flexDirection: 'column',
        marginHorizontal: wp('2%'),
        backgroundColor: Colors.white,
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: Colors.light_gray,
        borderWidth: 1,
        alignItems: 'center'
    },
    optionPrice: {
        fontSize: wp('2.7%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors.secondry_text_color,
        textAlign: 'center'
    },
    borderBox: {
        borderColor: Colors.themeColor,
        borderWidth: 1,
    },
    colorimageView: {
        height: hp('2%'),
        width: wp('4%'),
        borderRadius: 50,
        marginHorizontal: wp('1%'),
    },
    arrowRight: {
        fontSize: wp('3.5%'), textAlign: 'center', textAlignVertical: 'center', color: Colors.text_color
    },
    heartIconView: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingTxt: {
        fontSize: wp('4.5%'),
        fontFamily: Fonts.Font_Bold,
        textAlignVertical: 'center',
        flex: 0.80
    },
    subContainer: {
        flexDirection: 'row',
    },
    stock: {
        flex: 0.20,
        fontSize: wp('3%'),
        textAlignVertical: 'center',
        fontFamily: Fonts.Font_Semibold,
        textAlign: 'right'
    },
    productPrice: {
        fontSize: wp('5.5%'),
        fontFamily: Fonts.Font_Bold,
        textAlignVertical: 'center',
        color: Colors.themeColor,
        flex: 0.80
    },
    starView: {
        flex: 0.20
    },
    myStarStyle: {
        color: '#ffd12d',
        backgroundColor: 'transparent',
        marginHorizontal: 1,
        textShadowRadius: 1,
    },
    myEmptyStarStyle: {
        color: 'gray',
    },
    reviewTxt: {
        fontFamily: Fonts.Font_Reguler,
        fontSize: wp('2.5%'),
        marginTop: hp('0.3%'),
        textAlign: 'center',
        color: Colors.secondry_text_color
    },
    description: {
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Reguler,
        lineHeight: hp('2.4%'),
        color: Colors.secondry_text_color
    },


    footerView: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        height: hp('7.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        borderTopColor: Colors.light_gray,
        borderTopWidth: 1
    },
    countBox: {
        backgroundColor: Colors.light_white,
        flexDirection: 'row',
        flex: 0.20,
        height: hp('4.8%'),
        marginHorizontal: wp('1%'),
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        borderRadius: 5,
        justifyContent: 'center'
    },
    countTxt: {
        fontSize: wp('4.5%'),
        flex: 0.60,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.text_color,
        fontFamily: Fonts.Font_Semibold

    },
    arrowContainer: {
        flex: 0.40,
        flexDirection: 'column',
    },
    plusminusArrow: {
        fontSize: wp('5.2%'),

    },
    cancleIcon: {
        marginLeft: wp('3%'),
        height: wp('6%'),
        width: wp('6%'),
        tintColor: Colors.black
    },
    pageindexview: {
        position: 'absolute',
        marginTop: wp('4.5%'),
        flexDirection: 'row'
    },
    sizeBox: {
        height: hp('3%'),
        width: wp('12.5%'),
        marginHorizontal: wp('1.4%'),
        backgroundColor: Colors.light_white,
    },
    sizeTxt: {
        fontSize: wp('3.5%'),
        color: Colors.secondry_text_color,
        fontFamily: Fonts.Font_Reguler,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    pageindextext: {
        width: wp('15%'),
        textAlign: 'center',
        fontSize: wp('4.5%'),
        color: Colors.black_text,
        marginHorizontal: wp('34%')
    },
    dropdown: {
        height: 40,
        width: wp('60%'),
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    SpcialView: {
        flex: 0.80,
        flexDirection: 'row'
    },
    originalPrice: {
        color: Colors.secondry_text_color,
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('2.8%'),
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: wp('5.5%'),
        fontFamily: Fonts.Font_Bold,
        textAlignVertical: 'center',
        color: Colors.themeColor,
    },
    headingtext: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('4%'),
        marginTop: wp('2%'),
        marginBottom: wp('2%'),
        textAlign: 'left',
        textTransform: 'uppercase',
        padding: 2,

    },
    attributeView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: wp('1.2%'),
        paddingHorizontal: wp('3%'),
    },
    attributeTitle: {
        fontFamily: Fonts.Font_Segoe_UI_Reguler,
        fontSize: wp('4%'),
        width: wp('30%'),
        textAlign: 'left'
    },
    attributeInfo: {
        fontFamily: Fonts.Font_Segoe_UI_Reguler,
        fontSize: wp('4%'),
        width: wp('55%'),
        textAlign: 'left'
    },
});