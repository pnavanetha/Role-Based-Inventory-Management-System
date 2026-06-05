import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import Navbar from './Navigations/navbar';
import AppRoutes from './Routes/AppRoutes';
import { IProductListProps } from './IProductListProps';
import ProductService from './Services/ProductService';
import { spfi, SPFI } from '@pnp/sp';
import { SPFx } from '@pnp/sp/presets/all';
import { SPHttpClient } from '@microsoft/sp-http';

const ProductList: React.FC<IProductListProps> = (props) => {

  // const sp: SPFI = spfi().using(SPFx(props.context));
  const sp: SPFI = React.useMemo(() => spfi().using(SPFx(props.context)), [props.context]);  

  // const productService = new ProductService(sp);
  const productService = React.useMemo(()=> new ProductService(sp), [sp]);


  const [userRole, setUserRole] = React.useState<string>('');

  React.useEffect(() => {
    getCurrentUserRole();
  }, []);
  
  const getCurrentUserRole = async (): Promise<void> => {

      try {
        const url =
          `${props.context.pageContext.web.absoluteUrl}` +
          `/_api/web/currentuser/?$expand=Groups`;

        const response = await props.context.spHttpClient.get(
            url,
            SPHttpClient.configurations.v1
          );

        const data = await response.json();
        
        const groups = data.Groups || [];
        const groupNames = groups.map((g: any) => g.Title);
        console.log('User Groups:', groupNames);

        if (groupNames.includes('Inventory Admin')) {
          setUserRole('Inventory Admin');
        

          setUserRole(
            'Inventory Admin'
          );

        }
        else if (
          groupNames.includes(
            'Inventory Manager'
          )
        ) {

          setUserRole(
            'Inventory Manager'
          );

        }
        else if (
          groupNames.includes(
            'Inventory Staff'
          )
        ) {

          setUserRole(
            'Inventory Staff'
          );

        }

      }
      catch (error) {

        console.error(error);

      }

    };  

  return (
    <React.Fragment>
      <HashRouter>
      <div style={{ display: 'flex' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '20px' }}>
          <AppRoutes
            productService={productService}
            userRole={userRole}
          />
        </div>
      </div>
      </HashRouter>
    </React.Fragment>
  );
};

export default ProductList;