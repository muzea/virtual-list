import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import List from '../src';

describe('Props', () => {
  it('itemKey is a function', () => {
    class ItemComponent extends React.Component {
      render() {
        return this.props.children;
      }
    }

    const wrapper = mount(
      <List data={[{ id: 903 }, { id: 1128 }]} itemKey={(item) => item.id}>
        {({ id }) => <ItemComponent>{id}</ItemComponent>}
      </List>,
    );

    expect(wrapper.find('Item').at(0).key()).toBe('903');

    expect(wrapper.find('Item').at(1).key()).toBe('1128');
  });

  it('prefixCls', () => {
    const wrapper = mount(
      <List data={[0]} itemKey={(id) => id} prefixCls="prefix">
        {(id) => <div>{id}</div>}
      </List>,
    );

    expect(wrapper.find('.prefix-holder-inner').length).toBeTruthy();
  });

  it('no unnecessary re-render', () => {
    const renderItem = sinon.fake(({ id, key }) => <div key={key}>{id}</div>);
    const data = [{ id: 1, key: 1 }];
    function Wrapper() {
      const [state, setState] = React.useState(0);

      useEffect(() => {
        setState(1);
      }, []);

      return (
        <div>
          <h1>{state}</h1>
          <List data={data} itemKey="key" prefixCls="prefix">
            {renderItem}
          </List>
        </div>
      );
    }
    const wrapper = mount(<Wrapper />);
    expect(wrapper.find('h1').text()).toBe('1');
    expect(renderItem.callCount).toBe(1);
  });
});
