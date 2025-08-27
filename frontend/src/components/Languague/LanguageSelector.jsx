// import { useState, useEffect } from 'react';
// import { HStack, Image, Select } from '@chakra-ui/react';
// import { useTranslation } from 'react-i18next';

// const LanguageSelector = () => {
  // const { i18n, t } = useTranslation();
  // const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // useEffect(() => {
  //   // Load language from localStorage or default to browser language
  //   const savedLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];
  //   if (['en', 'fi'].includes(savedLanguage)) {
  //     setCurrentLanguage(savedLanguage);
  //     i18n.changeLanguage(savedLanguage).then(() => {
  //       console.log('Language initialized to:', savedLanguage);
  //     });
  //   } else {
  //     // Fallback to English if saved language is not supported
  //     setCurrentLanguage('en');
  //     i18n.changeLanguage('en');
  //   }
  // }, [i18n]);

  // const handleLanguageChange = (event) => {
  //   const newLanguage = event.target.value;
  //   setCurrentLanguage(newLanguage);
  //   localStorage.setItem('language', newLanguage);
  //   i18n.changeLanguage(newLanguage).then(() => {
  //     console.log('Language changed to:', newLanguage);
  //   }).catch((error) => {
  //     console.error('Error changing language:', error);
  //   });
  // };

//   return (
//     <HStack spacing={2}>

//       <Select.Root
//         value={currentLanguage}
//         onChange={handleLanguageChange}
//         id="language"
//       >
//         <Select.HiddenSelect />
//         <Select.Label></Select.Label>
//         <Select.Control>
//           <Select.Trigger>
//             <Select.ValueText/>
//           </Select.Trigger>
//           <Select.IndicatorGroup>
//             <Select.Indicator />
//             {/* <Select.ClearTrigger /> */}
//           </Select.IndicatorGroup>
//         </Select.Control>
//         <Select.Positioner>
//           <Select.Content>
//             <Select.Item item={"en"} key="en">EN</Select.Item>
//             <Select.Item item={"fi"} key="fi">FI</Select.Item>
//           </Select.Content>
//         </Select.Positioner>
//       </Select.Root>
//     </HStack>
//   );
// };

// export default LanguageSelector;


// "use client"
// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   HStack, 
//   Image,
//   For,
//   Portal,
//   Select,
//   Stack,
//   createListCollection,
// } from "@chakra-ui/react"
// import UkFlag from '../../../public/united-kingdom.png'
// import FiFlag from '../../../public/roundFi.png'

// const LanguageSelector = () => {
//   const { i18n, t } = useTranslation();
//   const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

//   useEffect(() => {
//     // Load language from localStorage or default to browser language
//     const savedLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];
//     if (['en', 'fi'].includes(savedLanguage)) {
//       setCurrentLanguage(savedLanguage);
//       i18n.changeLanguage(savedLanguage).then(() => {
//         console.log('Language initialized to:', savedLanguage);
//       });
//     } else {
//       // Fallback to English if saved language is not supported
//       setCurrentLanguage('en');
//       i18n.changeLanguage('en');
//     }
//   }, [i18n]);

//   const handleLanguageChange = (event) => {
//     const newLanguage = event.value;
//     setCurrentLanguage(newLanguage);
//     localStorage.setItem('language', newLanguage);
//     i18n.changeLanguage(newLanguage).then(() => {
//       console.log('Language changed to:', newLanguage);
//     }).catch((error) => {
//       console.error('Error changing language:', error);
//     });
//   };

//   const collection = createListCollection({
//     items: [
//       { value: 'en', label: 'En', image: UkFlag },
//       { value: 'fi', label: 'Fi', image: FiFlag },
//     ]
//   });
//   const selectedItem = collection.items.find((item) => item.value === currentLanguage);
//   return (
//     <Stack gap="5" width="100px">
//       <Select.Root 
//         // key={variant} 
//         // variant={variant} 
//         collection={collection}
//         value={currentLanguage}
//         onValueChange = {handleLanguageChange}>
//         <Select.HiddenSelect />
//         <Select.Label></Select.Label>
//         <Select.Control>
//           <Select.Trigger>
//             <Image
//                   boxSize="1.5rem"
//                   fit="cover"
//                   src={selectedItem.image}
//                   alt={selectedItem.label}
//                   mr={2}
//                 />
//             <Select.ValueText>{selectedItem.label}</Select.ValueText>
//           </Select.Trigger>
//           <Select.IndicatorGroup>
//             <Select.Indicator />
//           </Select.IndicatorGroup>
//         </Select.Control>
//         <Portal>
//           <Select.Positioner>
//             <Select.Content>
//               {collection.items.map((item) => (
//                 <Select.Item item={item} key={item.value}>
//                   <Image
//                     boxSize='1.5rem'
//                     objectFit='cover'
//                     src={item.value === 'en' ? '/united-kingdom.png' : '/roundFi.png'}
//                     alt={item.value === 'en' ? 'En' : 'Fi'}
//                     mr={2}
//                   />
//                   {item.label}
//                   <Select.ItemIndicator />
//                 </Select.Item>
//               ))}
//             </Select.Content>
//           </Select.Positioner>
//         </Portal>
//       </Select.Root>
//     </Stack>
//   )
// }

// export default LanguageSelector

// "use client";
// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   HStack,
//   Image,
//   Portal,
//   Select,
//   Stack,
//   createListCollection,
// } from "@chakra-ui/react";

// const LanguageSelector = () => {
//   const { i18n } = useTranslation();
//   const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

//   useEffect(() => {
//     // Load language from localStorage or default to browser language
//     const savedLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];
//     if (['en', 'fi'].includes(savedLanguage)) {
//       setCurrentLanguage(savedLanguage);
//       i18n.changeLanguage(savedLanguage).then(() => {
//         console.log('Language initialized to:', savedLanguage);
//       });
//     } else {
//       // Fallback to English if saved language is not supported
//       setCurrentLanguage('en');
//       i18n.changeLanguage('en');
//     }
//   }, [i18n]);

//   const handleLanguageChange = (event) => {
//     const newLanguage = event.value;
//     setCurrentLanguage(newLanguage);
//     localStorage.setItem('language', newLanguage);
//     i18n.changeLanguage(newLanguage).then(() => {
//       console.log('Language changed to:', newLanguage);
//     }).catch((error) => {
//       console.error('Error changing language:', error);
//     });
//   };

//   const collection = createListCollection({
//     items: [
//       { value: 'en', label: 'En', image: '/united-kingdom.png' },
//       { value: 'fi', label: 'Fi', image: '/roundFi.png' },
//     ],
//   });

//   const selectedItem = collection.items.find((item) => item.value === currentLanguage);

//   return (
//     <Stack gap="5" width="300px">
//       <Select.Root
//         collection={collection}
//         value={[currentLanguage]} // Use array for Chakra UI Select
//         onValueChange={handleLanguageChange}
//       >
//         <Select.HiddenSelect />
//         <Select.Label />
//         <Select.Control>
//           <Select.Trigger>
//             {selectedItem ? (
//               <HStack>
//                 <Image
//                   boxSize="1.5rem"
//                   objectFit="cover"
//                   src={selectedItem.image}
//                   alt={selectedItem.label}
//                   mr={2}
//                   onError={() => console.error(`Failed to load image: ${selectedItem.image}`)}
//                 />
//                 <Select.ValueText>{selectedItem.label}</Select.ValueText>
//               </HStack>
//             ) : (
//               <Select.ValueText>Select a language</Select.ValueText>
//             )}
//           </Select.Trigger>
//           <Select.IndicatorGroup>
//             <Select.Indicator />
//           </Select.IndicatorGroup>
//         </Select.Control>
//         <Portal>
//           <Select.Positioner>
//             <Select.Content>
//               {collection.items.map((item) => (
//                 <Select.Item item={item} key={item.value}>
//                   <Image
//                     boxSize="1.5rem"
//                     objectFit="cover"
//                     src={item.image}
//                     alt={item.label}
//                     mr={2}
//                     onError={() => console.error(`Failed to load image: ${item.image}`)}
//                   />
//                   <Select.ItemText>{item.label}</Select.ItemText>
//                   <Select.ItemIndicator />
//                 </Select.Item>
//               ))}
//             </Select.Content>
//           </Select.Positioner>
//         </Portal>
//       </Select.Root>
//     </Stack>
//   );
// };

// export default LanguageSelector;

"use client";
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HStack,
  Image,
  Portal,
  Select,
  Stack,
  createListCollection,
} from "@chakra-ui/react";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    // Load language from localStorage or default to browser language
    const savedLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];
    const targetLanguage = ['en', 'fi'].includes(savedLanguage) ? savedLanguage : 'en';
    
    // Update state and i18n language
    setCurrentLanguage(targetLanguage);
    i18n.changeLanguage(targetLanguage).then(() => {
      console.log('Language initialized to:', targetLanguage);
      // Ensure state is in sync with i18n.language
      if (i18n.language !== targetLanguage) {
        setCurrentLanguage(i18n.language);
      }
    }).catch((error) => {
      console.error('Error initializing language:', error);
    });
  }, [i18n]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.value;
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    i18n.changeLanguage(newLanguage).then(() => {
      console.log('Language changed to:', newLanguage);
      // Ensure state is in sync with i18n.language
      if (i18n.language !== newLanguage) {
        setCurrentLanguage(i18n.language);
      }
    }).catch((error) => {
      console.error('Error changing language:', error);
    });
  };

  const collection = createListCollection({
    items: [
      { value: 'en', label: 'En', image: '/united-kingdom.png' },
      { value: 'fi', label: 'Fi', image: '/roundFi.png' },
    ],
  });

  // Use useMemo to recompute selectedItem when currentLanguage changes
  const selectedItem = useMemo(() => {
    const item = collection.items.find((item) => item.value === currentLanguage);
    console.log('Selected item:', item); // Debug log
    return item;
  }, [currentLanguage, collection]);

  return (
    <Stack gap="5" width="100px">
      <Select.Root
        collection={collection}
        value={[currentLanguage]} // Use array for Chakra UI Select
        onValueChange={handleLanguageChange}
      >
        <Select.HiddenSelect />
        <Select.Label />
        <Select.Control>
          <Select.Trigger>
            {selectedItem ? (
              <HStack>
                <Image
                  boxSize="1.5rem"
                  objectFit="cover"
                  src={selectedItem.image}
                  alt={selectedItem.label}
                  mr={2}
                  onError={() => console.error(`Failed to load image: ${selectedItem.image}`)}
                />
                <Select.ValueText>{selectedItem.label}</Select.ValueText>
              </HStack>
            ) : (
              <Select.ValueText>Select a language</Select.ValueText>
            )}
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  <Image
                    boxSize="1.5rem"
                    objectFit="cover"
                    src={item.image}
                    alt={item.label}
                    mr={2}
                    onError={() => console.error(`Failed to load image: ${item.image}`)}
                  />
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Stack>
  );
};

export default LanguageSelector;