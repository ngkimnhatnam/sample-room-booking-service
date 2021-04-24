import * as authenticationHelper from '../helpers/authentication';

describe('Testing Auth Helper functions: Create Hash Password', () => {
  it('Should return a hashed string', async () => {
    const password = 'Password to be hashed';
    const result = await authenticationHelper.createPasswordHash(password);
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(result).not.toEqual(password);
  });
});

describe('Testing Auth Helper functions: Validate passwords', () => {
  it('Should return true when same password', async () => {
    const password = 'Password to be hashed';
    const hashed_pass = await authenticationHelper.createPasswordHash(password);
    const validationResult = await authenticationHelper.validatePasswordHash(password, hashed_pass);
    expect(validationResult).toBeDefined();
    expect(validationResult).not.toBeNull();
    expect(validationResult).toBeTruthy();
  });

  it('Should return false when different password', async () => {
    const password = 'Password to be hashed';
    const wrong_pass = 'This is the wrong pass';
    const hashed_pass = await authenticationHelper.createPasswordHash(password);
    const validationResult = await authenticationHelper.validatePasswordHash(wrong_pass, hashed_pass);
    expect(validationResult).toBeDefined();
    expect(validationResult).not.toBeNull();
    expect(validationResult).toBeFalsy();
  });
});
