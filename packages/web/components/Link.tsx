import MuiLink, { LinkProps as MuiLinkProps } from "@material-ui/core/Link";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import React from "react";

const NextComposed = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<NextLinkProps>
>((props, ref) => {
  const { children, as, href, ...other } = props;

  return (
    <NextLink href={href} as={as}>
      <a ref={ref} {...other}>
        {children}
      </a>
    </NextLink>
  );
});

type LinkProps = MuiLinkProps & NextLinkProps;

// A styled version of the Next.js Link component:
const Link: React.FC<LinkProps> = (props) => (
  <MuiLink component={NextComposed} ref={props.innerRef} {...props} />
);

export default React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<LinkProps>
>((props, ref) => <Link {...props} innerRef={ref} />);
