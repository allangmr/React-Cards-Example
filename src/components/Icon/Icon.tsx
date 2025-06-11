import { Suspense } from "react";

import * as icons from "../../assets/icons";
import { spacing } from "../../utils/spacing";

export interface IconProps extends React.SVGProps<SVGElement> {
	/** Icon name */
	name: icons.AvailableIcons;
	/** Icon title */
	title?: string;
	/** Icon title tag ID */
	titleId?: string;
	/** Icon color */
	color?: React.CSSProperties["color"];
	/** Icon width */
	width?: React.CSSProperties["width"];
	/** Icon height */
	height?: React.CSSProperties["height"];
	/** Icon size */
	size?: React.CSSProperties["width"] & React.CSSProperties["height"];
}

/**
 * The Icon component simplifies the process of incorporating icons into your application, making it easy to maintain a consistent and visually appealing user interface.
 *
 * ## Props
 * -   **name** `AvailableIcons`: The icon name.
 * -   **title** `string`: The icon title _(optional)_.
 * -   **titleId** `string`: The icon title tag ID _(optional)_.
 * -   **color** `React.CSSProperties["color"]`: The icon color _(optional)_.
 * -   **width** `React.CSSProperties["width"]`: The icon width _(optional)_.
 * -   **height** `React.CSSProperties["height"]`: The icon height _(optional)_.
 * -   **size** `React.CSSProperties["width"] | React.CSSProperties["height"]`: The icon size _(optional)_.
 *
 * ## Accessibility
 * ### Properly Labeling Icons
 * When using the `Icon` component, it's important to provide appropriate labels and descriptions for icons, especially when they convey meaning. To do this:
 * -   Use the `title` prop to provide a descriptive label for the icon.
 * -   Optionally, you can use the `aria-label` prop to provide an alternative label for the icon if necessary.
 *
 * #### Example:
 * ```
 * <Icon name="Radio" title="Search" aria-label="Search Icon"/>
 * ```
 *
 * ### Managing Focus and Keyboard Navigation
 * If the `Icon` component is interactive (e.g., clickable), it should be keyboard accessible to ensure users can interact with it using the keyboard. To achieve this:
 * -   Ensure that the `Icon` component can receive keyboard focus. If it's used as a button or link, make it focusable using the `tabIndex` attribute.
 * -   Implement event handlers for keyboard events (e.g., key press events) to allow users to activate the icon using keyboard controls (e.g., Enter or Spacebar).
 *
 * #### Example:
 * ```
 * <Icon name="Radio" title="Click Me!" tabIndex={0} onClick={() => alert("Clicked")}/>
 * ```
 *
 * ### ARIA Attributes and Roles
 * To enhance the accessibility of the `Icon` component, consider using ARIA attributes and roles:
 * -   Use the `role` attribute to indicate the purpose of the `Icon` component. For example, if it's a button, use `role="button"`.
 * -   Ensure that any non-text content within the icon, such as decorative elements, is properly labeled or hidden from screen readers using ARIA attributes like `aria-hidden="true"`.
 *
 * ### Specific Accessibility Considerations
 * -   The component has been designed with accessibility in mind by providing a `title` attribute for the SVG element, making it accessible to screen reader users.
 * -   The `title` attribute is automatically set based on the `title` prop provided when using the component.
 * -   The component uses lazy loading to optimize performance, but it maintains accessibility by providing a fallback representation with appropriate ARIA attributes.
 */
export function Icon({ name, title, titleId, color, width, height, size, ...props }: IconProps): React.ReactElement {
	const SvgComponent = icons[name] as React.ComponentType<IconProps>;

	if (!SvgComponent) return null as never;

	const styles = {
		...props.style,
		color: `var(--icon-color, ${color ?? "currentcolor"})`,
		width: `var(--icon-width, var(--icon-size, ${setSizeProperty(width ?? size)}))`,
		height: `var(--icon-height, var(--icon-size, ${setSizeProperty(height ?? size)}))`
	};

	return (
		<Suspense fallback={null}>
			<SvgComponent {...(props as IconProps)} width={undefined} height={undefined} title={title} titleId={titleId} style={styles} />
		</Suspense>
	);
}

/**
 * Sets a size property
 * @param property The property
 * @returns The property string
 */
function setSizeProperty(property: number | string | undefined): string {
	if (!property) return spacing("2");

	return typeof property === "number" ? `${property}px` : property;
}

export default Icon; 