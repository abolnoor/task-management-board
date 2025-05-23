import {  provideStore,  Store } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { UserStateModel, UserState } from './task.state';
import { SetUser } from './task.actions';

describe('[TEST]: User state', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([UserState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('Should be state is UserStateModel', () => {
    // Arrange
    const user: UserStateModel = {
      userId: '',
      departmentCode: '',
      departmentName: '',
      email: '',
      firstName: '',
      lastName: '',
      fullName: '',
      positionId: '',
      positionName: ''
    };

    // Act
    store.dispatch(new SetUser(user));
    const actual = store.selectSnapshot(({ user }) => user);

    // Assert
    expect(actual).toEqual(user);
  });

  it('Should be state is filled UserStateModel', () => {
    // Arrange
    const user: UserStateModel = {
      userId: '12',
      departmentCode: '2392',
      departmentName: 'Main office',
      email: 'agordon@google.com',
      firstName: 'Adam',
      lastName: 'Gordon',
      fullName: 'Adam Gordon',
      positionId: '102003',
      positionName: 'admin'
    };

    // Act
    store.dispatch(new SetUser(user));
    const actual = store.selectSnapshot<UserStateModel>(({ user }) => user);

    // Assert
    expect(actual).toEqual(user);
  });
});
